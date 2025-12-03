from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import aiofiles
from ..database import get_db
from ..models.models import Document, DocumentCategory, Admin
from ..schemas import (
    DocumentCategoryCreate, DocumentCategoryUpdate, DocumentCategoryResponse,
    DocumentResponse
)
from ..utils.auth import get_current_admin
from ..config import get_settings

router = APIRouter(prefix="/documents", tags=["documents"])
settings = get_settings()

@router.get("/categories", response_model=List[DocumentCategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(DocumentCategory).filter(
        DocumentCategory.parent_id == None
    ).order_by(DocumentCategory.order).all()
    return categories

@router.get("/categories/{category_id}", response_model=DocumentCategoryResponse)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/categories", response_model=DocumentCategoryResponse)
async def create_category(
    category_data: DocumentCategoryCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    category = DocumentCategory(**category_data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/categories/{category_id}", response_model=DocumentCategoryResponse)
async def update_category(
    category_id: int,
    category_data: DocumentCategoryUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    return category

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category.documents or category.children:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with documents or subcategories"
        )
    
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

@router.get("", response_model=List[DocumentResponse])
async def get_documents(
    category_id: Optional[int] = None,
    include_hidden: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if category_id:
        query = query.filter(Document.category_id == category_id)
    if not include_hidden:
        query = query.filter(Document.is_visible == True)
    
    documents = query.order_by(Document.order).all()
    return documents

@router.post("", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    category_id: int = Form(...),
    order: int = Form(0),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    import uuid
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    content = await file.read()
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    document = Document(
        title=title,
        filename=file.filename,
        file_path=file_path,
        file_size=len(content),
        category_id=category_id,
        order=order
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

@router.get("/{document_id}/download")
async def download_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        document.file_path,
        filename=document.filename,
        media_type='application/octet-stream'
    )

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}
