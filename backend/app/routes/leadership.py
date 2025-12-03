from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import LeadershipMember, Admin
from ..schemas import LeadershipMemberCreate, LeadershipMemberUpdate, LeadershipMemberResponse
from ..utils.auth import get_current_admin

router = APIRouter(prefix="/leadership", tags=["leadership"])

@router.get("", response_model=List[LeadershipMemberResponse])
async def get_leadership_members(
    include_hidden: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(LeadershipMember)
    if not include_hidden:
        query = query.filter(LeadershipMember.is_visible == True)
    
    members = query.order_by(LeadershipMember.order).all()
    return members

@router.get("/{member_id}", response_model=LeadershipMemberResponse)
async def get_leadership_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(LeadershipMember).filter(LeadershipMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    return member

@router.post("", response_model=LeadershipMemberResponse)
async def create_leadership_member(
    member_data: LeadershipMemberCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = LeadershipMember(**member_data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.put("/{member_id}", response_model=LeadershipMemberResponse)
async def update_leadership_member(
    member_id: int,
    member_data: LeadershipMemberUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = db.query(LeadershipMember).filter(LeadershipMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    
    update_data = member_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)
    
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}")
async def delete_leadership_member(
    member_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = db.query(LeadershipMember).filter(LeadershipMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    
    db.delete(member)
    db.commit()
    return {"message": "Leadership member deleted successfully"}
