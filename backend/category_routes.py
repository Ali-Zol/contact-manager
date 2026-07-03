from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from backend.database import get_session
from backend.models import Category, CategoryCreate, CategoryResponse, User
from backend.security import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])

# POST create new category
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_category = Category(name=data.name, user_id=current_user.id)
    session.add(new_category)
    session.commit()
    session.refresh(new_category)
    return new_category

# GET all category for any user
@router.get("/", response_model=List[CategoryResponse])
def get_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    categories = session.exec(
        select(Category).where(Category.user_id == current_user.id)
    ).all()

    return categories

# DELETE a category for any user
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category = session.get(Category, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    elif category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="You don't have access to this category")
    
    session.delete(category)
    session.commit()
    return