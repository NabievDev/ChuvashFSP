from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..database import get_db
from ..models.models import ContactMessage, Admin
from ..schemas import ContactMessageCreate, ContactMessageResponse
from ..utils.auth import get_current_admin
from ..config import get_settings

router = APIRouter(prefix="/contact", tags=["contact"])
settings = get_settings()

async def send_email_notification(message: ContactMessage):
    if not settings.smtp_user or not settings.smtp_password:
        print("SMTP not configured, skipping email notification")
        return
    
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.smtp_user
        msg['To'] = settings.contact_email
        msg['Subject'] = f"Новое сообщение: {message.subject}"
        
        body = f"""
Новое сообщение с сайта ФСП Чувашии

Имя: {message.name}
Email: {message.email}
Тема: {message.subject}

Сообщение:
{message.message}
        """
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True
        )
        print(f"Email notification sent for message from {message.email}")
    except Exception as e:
        print(f"Failed to send email notification: {e}")

@router.post("", response_model=ContactMessageResponse)
async def send_contact_message(
    message_data: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    message = ContactMessage(**message_data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    
    background_tasks.add_task(send_email_notification, message)
    
    return message

@router.get("", response_model=List[ContactMessageResponse])
async def get_contact_messages(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    query = db.query(ContactMessage)
    if unread_only:
        query = query.filter(ContactMessage.is_read == False)
    
    messages = query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.put("/{message_id}/read")
async def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    return {"message": "Message marked as read"}

@router.delete("/{message_id}")
async def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}
