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
        
        message_pattern = r'<div class="tgme_widget_message_wrap[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>\s*</div>'
        messages = re.findall(message_pattern, html, re.DOTALL)
        
        post_id_pattern = r'data-post="([^"]+)"'
        text_pattern = r'class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>'
        date_pattern = r'<time[^>]*datetime="([^"]+)"[^>]*>'
        image_pattern = r'background-image:url\([\'"]([^\'"]+)[\'"]\)'
        image_tag_pattern = r'<img[^>]*src="([^"]+)"[^>]*class="[^"]*tgme_widget_message_photo[^"]*"'
        photo_wrap_pattern = r'class="tgme_widget_message_photo_wrap[^"]*"[^>]*style="[^"]*background-image:url\([\'"]([^\'"]+)[\'"]\)'
        
        post_ids = re.findall(post_id_pattern, html)
        texts = re.findall(text_pattern, html, re.DOTALL)
        dates = re.findall(date_pattern, html)
        
        message_blocks = re.split(r'tgme_widget_message_wrap', html)[1:]
        
        for i, block in enumerate(message_blocks[:limit]):
            text_match = re.search(text_pattern, block, re.DOTALL)
            if not text_match:
                continue
                
            text_raw = text_match.group(1)
            
            if 'js-message_reply_text' in block.split('tgme_widget_message_text')[0]:
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
            
            post_id_match = re.search(post_id_pattern, block)
            post_id = post_id_match.group(1) if post_id_match else f"fspchuv/{i}"
            
            date_match = re.search(date_pattern, block)
            published = datetime.now()
            if date_match:
                try:
                    date_str = date_match.group(1).replace('T', ' ').split('+')[0]
                    published = datetime.fromisoformat(date_str)
                except:
                    pass
            
            image_url = None
            
            photo_match = re.search(photo_wrap_pattern, block)
            if photo_match:
                image_url = photo_match.group(1)
            
            if not image_url:
                bg_match = re.search(image_pattern, block)
                if bg_match:
                    image_url = bg_match.group(1)
            
            if not image_url:
                img_match = re.search(image_tag_pattern, block)
                if img_match:
                    image_url = img_match.group(1)
            
            if not image_url:
                all_bg_images = re.findall(r'background-image:url\([\'"]([^\'"]+)[\'"]\)', block)
                for img in all_bg_images:
                    if 'cdn' in img and ('jpg' in img or 'jpeg' in img or 'png' in img or 'webp' in img):
                        image_url = img
                        break
            
            post = {
                'telegram_id': post_id,
                'title': title,
                'content': text,
                'image_url': image_url,
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
        if existing:
            if post['image_url'] and not existing.image_url:
                existing.image_url = post['image_url']
                db.add(existing)
        else:
            news = News(
                title=post['title'],
                content=post['content'],
                image_url=post['image_url'],
                telegram_id=post['telegram_id'],
                published_at=post['published_at']
            )
            db.add(news)
    
    db.commit()
