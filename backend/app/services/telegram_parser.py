import httpx
from datetime import datetime
from typing import List, Dict, Optional
import re
import json

class TelegramParser:
    def __init__(self):
        self.channel = "fspchuv"
        self.base_url = f"https://t.me/s/{self.channel}"
    
    async def fetch_posts(self, limit: int = 20) -> List[Dict]:
        posts = []
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, timeout=30)
                if response.status_code == 200:
                    posts = self._parse_html(response.text, limit)
        except Exception as e:
            print(f"Error fetching Telegram posts: {e}")
        return posts
    
    def _parse_html(self, html: str, limit: int) -> List[Dict]:
        posts = []
        
        post_id_pattern = r'data-post="([^"]+)"'
        text_pattern = r'class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>'
        date_pattern = r'<time[^>]*datetime="([^"]+)"[^>]*>'
        image_pattern = r'background-image:url\([\'"]([^\'"]+)[\'"]\)'
        
        post_ids = re.findall(post_id_pattern, html)
        texts = re.findall(text_pattern, html, re.DOTALL)
        dates = re.findall(date_pattern, html)
        
        for i, text_raw in enumerate(texts[:limit]):
            if 'js-message_reply_text' in html.split(text_raw)[0].split('tgme_widget_message_text')[-1]:
                continue
                
            text = text_raw
            text = re.sub(r'<br\s*/?>', '\n', text)
            text = re.sub(r'<tg-emoji[^>]*>.*?</tg-emoji>', '', text, flags=re.DOTALL)
            text = re.sub(r'<[^>]+>', '', text)
            text = re.sub(r'&nbsp;', ' ', text)
            text = re.sub(r'&quot;', '"', text)
            text = re.sub(r'&#33;', '!', text)
            text = re.sub(r'&amp;', '&', text)
            text = text.strip()
            
            if not text or len(text) < 20:
                continue
            
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            title = lines[0][:200] if lines else "Новость"
            
            post_id = post_ids[i] if i < len(post_ids) else f"fspchuv/{i}"
            published = datetime.now()
            if i < len(dates):
                try:
                    date_str = dates[i].replace('T', ' ').split('+')[0]
                    published = datetime.fromisoformat(date_str)
                except:
                    pass
            
            post = {
                'telegram_id': post_id,
                'title': title,
                'content': text,
                'image_url': None,
                'published_at': published
            }
            posts.append(post)
        
        return posts[-limit:]

telegram_parser = TelegramParser()

async def sync_telegram_news(db):
    from ..models.models import News
    
    posts = await telegram_parser.fetch_posts(limit=30)
    
    for post in posts:
        existing = db.query(News).filter(News.telegram_id == post['telegram_id']).first()
        if not existing:
            news = News(
                title=post['title'],
                content=post['content'],
                image_url=post['image_url'],
                telegram_id=post['telegram_id'],
                published_at=post['published_at']
            )
            db.add(news)
    
    db.commit()
