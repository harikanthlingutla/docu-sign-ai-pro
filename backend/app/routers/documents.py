from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Path
from fastapi.responses import JSONResponse
from app.models import DocumentResponse, DocumentList, APIResponse
from app.services.supabase_service import upload_file, get_file_url, save_document_metadata, fetch_user_documents, delete_document
from app.routers.auth import get_current_user
from typing import Annotated, List
import os
import uuid
from datetime import datetime

router = APIRouter(tags=["Documents"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_file_type(filename: str):
    """Validate if the uploaded file has an allowed extension."""
    extension = filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return extension

@router.post("/upload", response_model=APIResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Upload a document (PDF/DOCX/TXT) to Supabase Storage
    and save metadata to the database.
    """
    try:
        # Validate file size
        file_size = 0
        file_content = bytearray()
        
        # Read file content in chunks to avoid memory issues
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            file_size += len(chunk)
            file_content.extend(chunk)
            if file_size > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB"
                )
        
        # Validate file type
        file_extension = validate_file_type(file.filename)
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"documents/{user_id}/{unique_filename}"
        
        # Upload file to Supabase Storage
        await upload_file("documents", file_path, file_content, file.content_type)
        
        # Get public URL
        file_url = await get_file_url("documents", file_path)
        
        # Save metadata to database
        document_metadata = await save_document_metadata(
            user_id=user_id,
            file_url=file_url,
            file_name=file.filename,
            file_type=file_extension
        )
        
        return APIResponse(
            status="success",
            data={
                "document_id": document_metadata.data[0]["id"],
                "file_name": file.filename,
                "file_type": file_extension,
                "file_url": file_url,
                "created_at": datetime.utcnow().isoformat()
            },
            message="Document uploaded successfully"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}"
        )
        
@router.get("/list", response_model=APIResponse)
async def list_documents(user_id: str = Depends(get_current_user)):
    """
    List all documents uploaded by the authenticated user.
    """
    try:
        # Fetch documents from database
        response = await fetch_user_documents(user_id)
        documents = response.data
        
        return APIResponse(
            status="success",
            data={"documents": documents},
            message="Documents retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve documents: {str(e)}"
        )

@router.delete("/{document_id}", response_model=APIResponse)
async def delete_document_endpoint(
    document_id: str = Path(..., description="The ID of the document to delete"),
    user_id: str = Depends(get_current_user)
):
    """
    Delete a document:
    1. Delete file from Supabase Storage
    2. Delete metadata from database
    """
    try:
        # Delete document
        result = await delete_document(document_id, user_id)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result.get("message", "Document not found or access denied")
            )
        
        return APIResponse(
            status="success",
            data=result,
            message="Document deleted successfully"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )
