from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.models import TeamMember, Admin
from ..schemas import TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse
from ..utils.auth import get_current_admin

router = APIRouter(prefix="/team", tags=["team"])

@router.get("", response_model=List[TeamMemberResponse])
async def get_team_members(
    category: Optional[str] = None,
    discipline: Optional[str] = None,
    include_hidden: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(TeamMember)
    if not include_hidden:
        query = query.filter(TeamMember.is_visible == True)
    if category:
        query = query.filter(TeamMember.category == category)
    if discipline:
        query = query.filter(TeamMember.discipline == discipline)
    
    members = query.order_by(TeamMember.order).all()
    return members

@router.get("/{member_id}", response_model=TeamMemberResponse)
async def get_team_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member

@router.post("", response_model=TeamMemberResponse)
async def create_team_member(
    member_data: TeamMemberCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = TeamMember(**member_data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.put("/{member_id}", response_model=TeamMemberResponse)
async def update_team_member(
    member_id: int,
    member_data: TeamMemberUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    update_data = member_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)
    
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}")
async def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    db.delete(member)
    db.commit()
    return {"message": "Team member deleted successfully"}
