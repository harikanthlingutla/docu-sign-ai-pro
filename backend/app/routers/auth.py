from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import UserSignup, UserLogin, UserResponse, APIResponse
from app.services.supabase_service import register_user, login_user, store_user_public_key
from app.services.crypto_service import generate_dilithium_keypair
from typing import Annotated
import json
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

# Constants
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()

# JWT Dependency
async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    """Validates JWT and attaches user_id to request."""
    try:
        payload = jwt.decode(
            credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

@router.post("/signup", response_model=APIResponse)
async def signup(user: UserSignup):
    """
    Register a new user with:
    1. Supabase Auth registration
    2. Dilithium2 keypair generation
    3. Public key storage in database
    """
    try:
        # Register user with Supabase
        auth_response = await register_user(user.email, user.password)
        user_id = auth_response.user.id
        
        # Generate Dilithium2 keypair
        private_key, public_key = await generate_dilithium_keypair()
        
        # Store public key in database
        await store_user_public_key(user_id, public_key)
        
        # Return success response with JWT
        access_token = auth_response.session.access_token
        refresh_token = auth_response.session.refresh_token
        
        return APIResponse(
            status="success",
            data={
                "user_id": user_id,
                "email": user.email,
                "access_token": access_token,
                "refresh_token": refresh_token,
                # Important: Private key should be returned only once at signup
                "private_key": private_key
            },
            message="User registered successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=APIResponse)
async def login(user: UserLogin):
    """
    Authenticate a user and return JWT token
    """
    try:
        # Authenticate with Supabase
        auth_response = await login_user(user.email, user.password)
        
        return APIResponse(
            status="success",
            data={
                "user_id": auth_response.user.id,
                "email": user.email,
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token
            },
            message="Login successful"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )

# Middleware class to attach to main.py if needed
class JWTMiddleware:
    async def __call__(self, request: Request, call_next):
        if request.url.path in ["/auth/signup", "/auth/login", "/"]:
            return await call_next(request)
            
        try:
            token = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing or invalid authorization header"
                )
                
            token = token.split(" ")[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            request.state.user_id = payload.get("sub")
            
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
            
        return await call_next(request)
