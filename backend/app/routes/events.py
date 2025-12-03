from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..models.models import Event, Admin
from ..schemas import EventCreate, EventUpdate, EventResponse
from ..utils.auth import get_current_admin

router = APIRouter(prefix="/events", tags=["events"])

@router.get("", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 50,
    include_hidden: bool = False,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    if not include_hidden:
        query = query.filter(Event.is_visible == True)
    
    if month and year:
        from sqlalchemy import extract
        query = query.filter(
            extract('month', Event.event_date) == month,
            extract('year', Event.event_date) == year
        )
    
    events = query.order_by(Event.event_date.asc()).offset(skip).limit(limit).all()
    return events

@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(
    limit: int = 5,
    db: Session = Depends(get_db)
):
    today = date.today()
    events = db.query(Event).filter(
        Event.is_visible == True,
        Event.event_date >= today
    ).order_by(Event.event_date.asc()).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    event = Event(**event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
