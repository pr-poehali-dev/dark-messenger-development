import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime

def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def handler(event: dict, context) -> dict:
    '''API для управления чатами, группами и каналами'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        if method == 'GET':
            action = event.get('queryStringParameters', {}).get('action', '')
            user_id = event.get('queryStringParameters', {}).get('user_id', '')
            
            if action == 'list':
                # Получить все чаты пользователя
                cur.execute(f'''
                    SELECT c.*, cm.role,
                           (SELECT COUNT(*) FROM {schema}.messages WHERE chat_id = c.id) as message_count
                    FROM {schema}.chats c
                    JOIN {schema}.chat_members cm ON c.id = cm.chat_id
                    WHERE cm.user_id = %s
                    ORDER BY c.created_at DESC
                ''', (user_id,))
                chats = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(chat) for chat in chats], default=json_serial),
                    'isBase64Encoded': False
                }
            
            elif action == 'members':
                chat_id = event.get('queryStringParameters', {}).get('chat_id', '')
                cur.execute(f'''
                    SELECT u.id, u.nickname, u.username, u.avatar_url, u.verified, cm.role
                    FROM {schema}.users u
                    JOIN {schema}.chat_members cm ON u.id = cm.user_id
                    WHERE cm.chat_id = %s
                ''', (chat_id,))
                members = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(m) for m in members], default=json_serial),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            action = data.get('action', '')
            
            if action == 'create':
                # Создать группу или канал
                user_id = data.get('user_id')
                chat_type = data.get('type', 'group')
                name = data.get('name')
                avatar_url = data.get('avatar_url', '')
                
                cur.execute(f'''
                    INSERT INTO {schema}.chats (type, name, avatar_url, created_by)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, type, name, avatar_url, created_by, created_at
                ''', (chat_type, name, avatar_url, user_id))
                chat = cur.fetchone()
                
                # Добавить создателя как админа
                cur.execute(f'''
                    INSERT INTO {schema}.chat_members (chat_id, user_id, role)
                    VALUES (%s, %s, 'admin')
                ''', (chat['id'], user_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'chat': dict(chat)}, default=json_serial),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_member':
                chat_id = data.get('chat_id')
                user_id = data.get('user_id')
                role = data.get('role', 'member')
                
                cur.execute(f'''
                    INSERT INTO {schema}.chat_members (chat_id, user_id, role)
                    VALUES (%s, %s, %s)
                ''', (chat_id, user_id, role))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            data = json.loads(event.get('body', '{}'))
            action = data.get('action', '')
            
            if action == 'remove_member':
                chat_id = data.get('chat_id')
                user_id = data.get('user_id')
                
                cur.execute(f'''
                    DELETE FROM {schema}.chat_members
                    WHERE chat_id = %s AND user_id = %s
                ''', (chat_id, user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()