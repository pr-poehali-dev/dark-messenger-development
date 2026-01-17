import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления профилем, друзьями, черным списком'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    schema = os.environ['MAIN_DB_SCHEMA']
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            action = params.get('action')
            
            if action == 'stats':
                cur.execute(f'''
                    SELECT 
                        (SELECT COUNT(*) FROM {schema}.friendships WHERE user_id = %s AND status = 'accepted') as friends_count,
                        (SELECT COUNT(DISTINCT chat_id) FROM {schema}.chat_members WHERE user_id = %s 
                         AND chat_id IN (SELECT id FROM {schema}.chats WHERE type = 'group')) as groups_count,
                        (SELECT COUNT(DISTINCT chat_id) FROM {schema}.chat_members WHERE user_id = %s 
                         AND chat_id IN (SELECT id FROM {schema}.chats WHERE type = 'channel')) as channels_count
                ''', (user_id, user_id, user_id))
                
                stats = dict(cur.fetchone())
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(stats),
                    'isBase64Encoded': False
                }
            
            elif action == 'friends':
                cur.execute(f'''
                    SELECT u.id, u.nickname, u.username, u.avatar_url, u.show_online
                    FROM {schema}.users u
                    JOIN {schema}.friendships f ON (f.friend_id = u.id OR f.user_id = u.id)
                    WHERE (f.user_id = %s OR f.friend_id = %s) AND f.status = 'accepted' AND u.id != %s
                ''', (user_id, user_id, user_id))
                
                friends = [dict(row) for row in cur.fetchall()]
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(friends),
                    'isBase64Encoded': False
                }
            
            elif action == 'blocked':
                cur.execute(f'''
                    SELECT u.id, u.nickname, u.username, u.avatar_url
                    FROM {schema}.users u
                    JOIN {schema}.blocked_users b ON b.blocked_user_id = u.id
                    WHERE b.user_id = %s
                ''', (user_id,))
                
                blocked = [dict(row) for row in cur.fetchall()]
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(blocked),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            action = body.get('action')
            
            if action == 'update_profile':
                updates = []
                values = []
                
                if 'nickname' in body:
                    updates.append('nickname = %s')
                    values.append(body['nickname'])
                if 'username' in body:
                    updates.append('username = %s')
                    values.append(body['username'])
                if 'avatar_url' in body:
                    updates.append('avatar_url = %s')
                    values.append(body['avatar_url'])
                if 'banner_url' in body:
                    updates.append('banner_url = %s')
                    values.append(body['banner_url'])
                if 'language' in body:
                    updates.append('language = %s')
                    values.append(body['language'])
                if 'theme' in body:
                    updates.append('theme = %s')
                    values.append(body['theme'])
                
                values.append(user_id)
                
                cur.execute(f'''
                    UPDATE {schema}.users 
                    SET {', '.join(updates)}
                    WHERE id = %s
                    RETURNING id, phone, nickname, username, avatar_url, banner_url, 
                              verified, enots, is_admin, language, theme
                ''', values)
                
                user = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user': user}),
                    'isBase64Encoded': False
                }
            
            elif action == 'verify_user':
                admin_id = body.get('admin_id')
                target_user_id = body.get('target_user_id')
                
                cur.execute(f'SELECT is_admin FROM {schema}.users WHERE id = %s', (admin_id,))
                is_admin = cur.fetchone()
                
                if not is_admin or not is_admin['is_admin']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Admin access required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f'''
                    UPDATE {schema}.users SET verified = TRUE WHERE id = %s
                    RETURNING id, nickname, username, verified
                ''', (target_user_id,))
                
                user = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user': user}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            user_id = body.get('user_id')
            
            if action == 'block':
                blocked_user_id = body.get('blocked_user_id')
                
                cur.execute(f'''
                    INSERT INTO {schema}.blocked_users (user_id, blocked_user_id)
                    VALUES (%s, %s)
                    ON CONFLICT (user_id, blocked_user_id) DO NOTHING
                ''', (user_id, blocked_user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'unblock':
                blocked_user_id = body.get('blocked_user_id')
                
                cur.execute(f'''
                    DELETE FROM {schema}.blocked_users 
                    WHERE user_id = %s AND blocked_user_id = %s
                ''', (user_id, blocked_user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_friend':
                friend_username = body.get('friend_username')
                
                cur.execute(f'SELECT id FROM {schema}.users WHERE username = %s', (friend_username,))
                friend = cur.fetchone()
                
                if not friend:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f'''
                    INSERT INTO {schema}.friendships (user_id, friend_id, status)
                    VALUES (%s, %s, 'pending')
                    ON CONFLICT (user_id, friend_id) DO NOTHING
                ''', (user_id, friend['id']))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
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
