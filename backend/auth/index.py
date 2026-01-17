import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для регистрации и авторизации пользователей Speaky'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    schema = os.environ['MAIN_DB_SCHEMA']
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                phone = body.get('phone')
                nickname = body.get('nickname')
                username = body.get('username', f"@{nickname.lower().replace(' ', '')}")
                
                cur.execute(f'''
                    INSERT INTO {schema}.users (phone, nickname, username)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (phone) DO UPDATE 
                    SET nickname = EXCLUDED.nickname, username = EXCLUDED.username
                    RETURNING id, phone, nickname, username, avatar_url, banner_url, 
                              verified, enots, is_admin, language, theme, created_at
                ''', (phone, nickname, username))
                
                user = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user': user}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                phone = body.get('phone')
                
                cur.execute(f'''
                    SELECT id, phone, nickname, username, avatar_url, banner_url,
                           verified, enots, is_admin, language, theme, created_at
                    FROM {schema}.users
                    WHERE phone = %s
                ''', (phone,))
                
                user = cur.fetchone()
                
                if user:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True, 'user': dict(user)}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
