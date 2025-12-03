from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500))
    content = Column(Text)
    image_url = Column(String(1000), nullable=True)
    telegram_id = Column(String(100), nullable=True, unique=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500))
    description = Column(Text, nullable=True)
    event_date = Column(Date)
    event_time = Column(String(10), nullable=True)
    location = Column(String(500), nullable=True)
    event_type = Column(String(100), nullable=True)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentCategory(Base):
    __tablename__ = "document_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    parent_id = Column(Integer, ForeignKey("document_categories.id"), nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    parent = relationship("DocumentCategory", remote_side=[id], backref="children")
    documents = relationship("Document", back_populates="category")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500))
    filename = Column(String(500))
    file_path = Column(String(1000))
    file_size = Column(Integer, nullable=True)
    category_id = Column(Integer, ForeignKey("document_categories.id"))
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("DocumentCategory", back_populates="documents")

class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(300))
    position = Column(String(200), nullable=True)
    city = Column(String(200), nullable=True)
    category = Column(String(100))
    discipline = Column(String(200), nullable=True)
    photo_url = Column(String(1000), nullable=True)
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LeadershipMember(Base):
    __tablename__ = "leadership_members"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(300))
    position = Column(String(300))
    description = Column(Text, nullable=True)
    photo_url = Column(String(1000), nullable=True)
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    email = Column(String(200))
    subject = Column(String(500), nullable=True)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
