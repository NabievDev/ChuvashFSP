from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminCreate(BaseModel):
    username: str
    password: str

class NewsBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    is_visible: bool = True

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_visible: Optional[bool] = None

class NewsResponse(NewsBase):
    id: int
    telegram_id: Optional[str] = None
    published_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: date
    event_time: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[str] = None
    is_visible: bool = True

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[str] = None
    is_visible: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentCategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    order: int = 0

class DocumentCategoryCreate(DocumentCategoryBase):
    pass

class DocumentCategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None
    order: Optional[int] = None

class DocumentBase(BaseModel):
    title: str
    category_id: int
    order: int = 0
    is_visible: bool = True

class DocumentResponse(DocumentBase):
    id: int
    filename: str
    file_path: str
    file_size: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentCategoryResponse(DocumentCategoryBase):
    id: int
    created_at: datetime
    documents: List[DocumentResponse] = []
    children: List["DocumentCategoryResponse"] = []
    
    class Config:
        from_attributes = True

class TeamMemberBase(BaseModel):
    full_name: str
    position: Optional[str] = None
    city: Optional[str] = None
    category: str
    discipline: Optional[str] = None
    photo_url: Optional[str] = None
    order: int = 0
    is_visible: bool = True

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    full_name: Optional[str] = None
    position: Optional[str] = None
    city: Optional[str] = None
    category: Optional[str] = None
    discipline: Optional[str] = None
    photo_url: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None

class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class LeadershipMemberBase(BaseModel):
    full_name: str
    position: str
    description: Optional[str] = None
    photo_url: Optional[str] = None
    order: int = 0
    is_visible: bool = True

class LeadershipMemberCreate(LeadershipMemberBase):
    pass

class LeadershipMemberUpdate(BaseModel):
    full_name: Optional[str] = None
    position: Optional[str] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None

class LeadershipMemberResponse(LeadershipMemberBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageResponse(ContactMessageCreate):
    id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
