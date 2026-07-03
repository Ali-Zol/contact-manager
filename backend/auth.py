from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from backend.database import get_session
from backend.models import User, UserRegister, UserLogin
from backend.security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ---- User Registration ----
@router.post("/register", status_code=201)
def register(
    data: UserRegister,
    session: Session = Depends(get_session),
):
    # Check if username already exists
    existing = session.exec(
        select(User).where(User.username == data.username)
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This username is already taken",
        )

    # Create new user with hashed password
    new_user = User(
        username=data.username,
        hashed_password=hash_password(data.password),
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "Registration successful", "user_id": new_user.id}


# ---- User Login  ----
@router.post("/login")
def login(
    data: UserLogin,
    session: Session = Depends(get_session),
):
    # Find the user by username
    user = session.exec(
        select(User).where(User.username == data.username)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    # Verify the password
    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    # Generate JWT token
    token = create_token(user.id)

    return {"access_token": token, "token_type": "bearer", "message": "Login successful"}