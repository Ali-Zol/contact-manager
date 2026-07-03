from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from backend.database import get_session
from backend.models import *
from backend.security import get_current_user
from backend.models import User

router = APIRouter(prefix="/contacts", tags=["Contacts"])

# GET all contacts
@router.get("/", response_model=List[ContactResponse])
def get_contacts(
    name: Optional[str] = None,
    phone: Optional[str] = None,
    email: Optional[str] = None,
    category_id: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    query = select(Contact)

    if name:
        query = query.where(Contact.name.contains(name))
    if phone:
        query = query.where(Contact.phone.contains(phone))
    if email:
        query = query.where(Contact.email.contains(email))
    if category_id:
        category = session.get(Category, category_id)
        
        if not category:
            raise HTTPException(status_code=403, detail="Category not found")
        elif category.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You don't have access to this category")
        
        query = query.where(Contact.category_id == category_id)

    contacts = session.exec(query).all()
    return contacts

# GET one contact by ID
@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    contact = session.get(Contact, contact_id)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

# POST create new contact
@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(
    data: ContactCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if data.category_id is not None:
        category = session.get(Category, data.category_id)
    
        if not category:
            raise HTTPException(status_code=403, detail="Category not found")
        elif category.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You don't have access to this category")

    new_contact = Contact(**data.model_dump())
    session.add(new_contact)
    session.commit()
    session.refresh(new_contact)
    return new_contact

# PUT update a contact
@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    data: ContactCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if data.category_id is not None:
        category = session.get(Category, data.category_id)
    
        if not category:
            raise HTTPException(status_code=403, detail="Category not found")
        elif category.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You don't have access to this category")

    contact = session.get(Contact, contact_id)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    for key, value in data.model_dump().items():
        setattr(contact, key, value)

    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact

# DELETE a contact
@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    contact = session.get(Contact, contact_id)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    session.delete(contact)
    session.commit()
    return