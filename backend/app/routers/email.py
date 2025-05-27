from fastapi import APIRouter, Depends, HTTPException, Form, status
from app.models import EmailRequest, APIResponse
from app.services.email_service import send_signed_document
from app.services.supabase_service import download_file
from app.routers.auth import get_current_user
from typing import Optional
import os

router = APIRouter(tags=["Email"])

@router.post("/send-signed-document", response_model=APIResponse)
async def send_signed_document_endpoint(
    document_id: str = Form(...),
    recipient_email: str = Form(...),
    subject: Optional[str] = Form(None),
    message: Optional[str] = Form(None),
    user_id: str = Depends(get_current_user)
):
    """
    Send a signed document via email:
    1. Fetch signed document from Storage
    2. Send the document to recipient email via SMTP
    """
    try:
        # Fetch document from Storage
        # In a real app, you'd first query the database to get the correct path
        # For this example, we'll use a simplified approach
        document_path = f"signed_documents/{user_id}/{document_id}.pdf"
        
        try:
            document_content = await download_file("documents", document_path)
        except Exception as e:
            # If not found in signed_documents, try the guest_signed folder
            document_path = f"guest_signed/{document_id}.pdf"
            document_content = await download_file("documents", document_path)
        
        # Get document name from path
        document_name = document_path.split("/")[-1]
        
        # Get sender name (in a real app, fetch from user profile)
        sender_name = "Document Signer"  # Placeholder
        
        # Send email
        email_sent = await send_signed_document(
            to_email=recipient_email,
            document_name=document_name,
            document_content=document_content,
            sender_name=sender_name,
            custom_message=message
        )
        
        if not email_sent:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email"
            )
        
        return APIResponse(
            status="success",
            data={
                "recipient_email": recipient_email,
                "document_id": document_id
            },
            message="Signed document sent successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send signed document: {str(e)}"
        )
