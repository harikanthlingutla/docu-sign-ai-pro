from fastapi import APIRouter, Depends, HTTPException, status
from app.models import APIResponse
from app.routers.auth import get_current_user
from app.services.supabase_service import get_user_profile, update_user_profile
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["Profile"])

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None

@router.get("/get", response_model=APIResponse)
async def get_profile(user_id: str = Depends(get_current_user)):
    """
    Fetch user's profile information:
    - Full name
    - Organization
    - Email
    - Current plan
    - Document usage
    """
    try:
        # Fetch user profile from Supabase
        profile_data = await get_user_profile(user_id)
        
        return APIResponse(
            status="success",
            data=profile_data,
            message="Profile retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve profile: {str(e)}"
        )

@router.post("/update", response_model=APIResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Update user's profile information:
    - Full name
    - Organization
    """
    try:
        # Update user profile in Supabase
        updated_profile = await update_user_profile(
            user_id=user_id,
            full_name=profile_data.full_name,
            organization=profile_data.organization
        )
        
        return APIResponse(
            status="success",
            data=updated_profile,
            message="Profile updated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
