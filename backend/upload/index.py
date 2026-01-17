import json
import os
import base64
import boto3
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для загрузки фото, видео, аудио файлов в S3'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        file_data = body.get('file')
        file_type = body.get('type', 'photo')
        user_id = body.get('user_id')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No file data provided'}),
                'isBase64Encoded': False
            }
        
        file_bytes = base64.b64decode(file_data)
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        ext_map = {'photo': 'jpg', 'video': 'mp4', 'voice': 'ogg', 'avatar': 'jpg', 'banner': 'jpg'}
        ext = ext_map.get(file_type, 'jpg')
        
        file_key = f'speaky/{file_type}s/{user_id}_{timestamp}.{ext}'
        
        content_type_map = {
            'photo': 'image/jpeg',
            'video': 'video/mp4',
            'voice': 'audio/ogg',
            'avatar': 'image/jpeg',
            'banner': 'image/jpeg'
        }
        
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=file_bytes,
            ContentType=content_type_map.get(file_type, 'application/octet-stream')
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'url': cdn_url}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
