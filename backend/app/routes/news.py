from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import News, Admin
from ..schemas import NewsCreate, NewsUpdate, NewsResponse
from ..utils.auth import get_current_admin

router = APIRouter(prefix="/news", tags=["news"])

@router.get("", response_model=List[NewsResponse])
async def get_news(
    skip: int = 0,
    limit: int = 20,
    include_hidden: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(News)
    if not include_hidden:
        query = query.filter(News.is_visible == True)
    news = query.order_by(News.published_at.desc()).offset(skip).limit(limit).all()
    return news

@router.get("/{news_id}", response_model=NewsResponse)
async def get_news_item(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.post("", response_model=NewsResponse)
async def create_news(
    news_data: NewsCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    news = News(**news_data.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news

@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_data: NewsUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    update_data = news_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(news, key, value)
    
    db.commit()
    db.refresh(news)
    return news

@router.delete("/{news_id}")
async def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.delete(news)
    db.commit()
    return {"message": "News deleted successfully"}
