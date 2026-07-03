from sqlmodel import SQLModel, Field as SQLField
from pydantic import Field as PydanticField
from typing import Optional

# ---------- Contact Models (main application) ----------

class Contact(SQLModel, table=True):
    """Database model for contacts table"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str
    phone: str
    email: str
    category_id: Optional[int] = SQLField(
        default=None,
        foreign_key="category.id",
        ondelete="SET NULL"
    )

class ContactCreate(SQLModel):
    """Pydantic model for creating a new contact"""
    name: str
    phone: str = PydanticField(..., pattern=r"^09\d{9}$")
    email: str = PydanticField(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.]+\.[a-zA-Z]+$")
    category_id: Optional[int] = None

class ContactResponse(SQLModel):
    """Response model for contact data (output)"""
    id: int
    name: str
    phone: str
    email: str
    category_id: Optional[int] = None


# ---------- Category Models ----------

class Category(SQLModel, table=True):
    """Category table for grouping contacts"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str
    user_id: int = SQLField(foreign_key="user.id")      # Each category belongs to a user

class CategoryCreate(SQLModel):
    """Input model for creating a new category"""
    name: str

class CategoryResponse(SQLModel):
    """Output model for category data"""
    id: int
    name: str
    user_id: int


# ---------- User Models (authentication) ----------

class User(SQLModel, table=True):
    """User model for authentication"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    username: str = SQLField(unique=True, index=True)
    hashed_password: str

class UserCreate(SQLModel):
    """Data model for user registration"""
    username: str
    password: str

class UserRegister(SQLModel):
    """Data model for user registration"""
    username: str
    password: str

class UserLogin(SQLModel):
    """Data model for login request"""
    username: str
    password: str

class TokenResponse(SQLModel):
    """Response model after login"""
    access_token: str
    token_type: str = "bearer"