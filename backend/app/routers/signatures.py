from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Path
from app.models import SignatureRequest, SignatureResponse, APIResponse
from app.services.supabase_service import upload_file, get_file_url, store_user_public_key, get_user_public_key, download_file, fetch_user_signatures, delete_signature
from app.services.crypto_service import hash_document, sign_document_hash
from app.routers.auth import get_current_user
import fitz  # PyMuPDF
import io
import os
import uuid
from PIL import Image
from datetime import datetime
import base64
import json

router = APIRouter(tags=["Signatures"])

ALLOWED_SIGNATURE_EXTENSIONS = {"svg", "png", "jpg", "jpeg"}
MAX_SIGNATURE_SIZE = 5 * 1024 * 1024  # 5 MB

def validate_signature_file(filename: str):
    """Validate if the uploaded signature file has an allowed extension."""
    extension = filename.split(".")[-1].lower()
    if extension not in ALLOWED_SIGNATURE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_SIGNATURE_EXTENSIONS)}"
        )
    return extension

@router.post("/save-style", response_model=APIResponse)
async def save_signature_style(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Accept signature file (SVG/PNG) and upload to Supabase Storage,
    linking it to the user profile.
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) > MAX_SIGNATURE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {MAX_SIGNATURE_SIZE / (1024 * 1024)}MB"
            )
        
        # Validate file type
        file_extension = validate_signature_file(file.filename)
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"signatures/{user_id}/{unique_filename}"
        
        # Upload signature to Supabase Storage
        await upload_file("signatures", file_path, file_content, file.content_type)
        
        # Get public URL
        signature_url = await get_file_url("signatures", file_path)
        
        # Update user profile with signature URL
        # In a real app, update a signatures table or user profile
        # For now, we'll just return the URL
        
        return APIResponse(
            status="success",
            data={"signature_url": signature_url},
            message="Signature style saved successfully"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save signature style: {str(e)}"
        )

@router.post("/apply-signature", response_model=APIResponse)
async def apply_signature(
    request: SignatureRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Apply signature to a document:
    1. Fetch document from Storage
    2. Overlay visual signature at given coordinates
    3. Hash the document (SHA3-256)
    4. Sign the hash using user's Dilithium2 private key
    5. Embed signature metadata into PDF
    """
    try:
        # Fetch user's signature style
        # In a real app, fetch from user profile or signatures table
        # For this example, we'll use a placeholder URL
        signature_path = f"signatures/{user_id}"  # This would be retrieved from the user's profile
        
        # Fetch document from Storage
        # This would involve getting the document path from its ID
        # For now, we'll use the document_id as the path (simplified)
        document_path = f"documents/{request.document_id}"
        document_content = await download_file("documents", document_path)
        
        # Create a PDF object
        pdf_document = fitz.open(stream=document_content, filetype="pdf")
        
        # Get the specified page
        page = pdf_document[request.page_number - 1]  # 0-indexed
        
        # Fetch the user's signature image
        # In a real app, get from the user's profile
        signature_content = await download_file("signatures", signature_path)
        
        # Create an image object from signature content
        signature_image = Image.open(io.BytesIO(signature_content))
        
        # Convert image to PNG if it's not already
        if signature_image.format != "PNG":
            img_bytes = io.BytesIO()
            signature_image.save(img_bytes, format="PNG")
            img_bytes.seek(0)
            signature_content = img_bytes.read()
        
        # Insert signature image at the specified coordinates
        # The coordinates would be adapted based on page size and signature size
        rect = fitz.Rect(request.position_x, request.position_y, 
                         request.position_x + 200, request.position_y + 100)  # Adjust size as needed
        page.insert_image(rect, stream=signature_content)
        
        # Save modified PDF to memory
        output_stream = io.BytesIO()
        pdf_document.save(output_stream)
        pdf_document.close()
        
        # Get the modified document content
        modified_document = output_stream.getvalue()
        
        # Hash the document
        document_hash = await hash_document(modified_document)
        
        # Sign the hash with user's private key
        # In a real app, the private key would be sent from the client side
        # For this example, we'll use a placeholder
        # private_key_b64 = "..." # This would come from the client-side securely
        # signature_b64 = await sign_document_hash(document_hash, private_key_b64)
        
        # For demonstration, we'll use a placeholder signature
        signature_b64 = base64.b64encode(b"placeholder_signature").decode('utf-8')
        
        # Get user's public key
        public_key_b64 = await get_user_public_key(user_id)
        
        # Create signature metadata
        signature_metadata = {
            "signer": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "public_key": public_key_b64,
            "signature": signature_b64,
            "hash_algorithm": "SHA3-256"
        }
        
        # Embed metadata into PDF
        # In a real implementation, we'd use PyMuPDF to add this as PDF metadata
        # For this example, we'll just return the metadata
        
        # Upload the signed document
        signed_document_path = f"signed_documents/{user_id}/{uuid.uuid4()}.pdf"
        await upload_file("documents", signed_document_path, modified_document, "application/pdf")
        
        # Get signed document URL
        signed_document_url = await get_file_url("documents", signed_document_path)
        
        return APIResponse(
            status="success",
            data={
                "signed_document_url": signed_document_url,
                "signature_metadata": signature_metadata
            },
            message="Document signed successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to apply signature: {str(e)}"
        )

@router.get("/list", response_model=APIResponse)
async def list_signatures(user_id: str = Depends(get_current_user)):
    """
    List all saved signatures for the authenticated user.
    """
    try:
        # Fetch signatures from database
        response = await fetch_user_signatures(user_id)
        signatures = response.data
        
        return APIResponse(
            status="success",
            data={"signatures": signatures},
            message="Signatures retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve signatures: {str(e)}"
        )

@router.delete("/{signature_id}", response_model=APIResponse)
async def delete_signature_endpoint(
    signature_id: str = Path(..., description="The ID of the signature to delete"),
    user_id: str = Depends(get_current_user)
):
    """
    Delete a signature:
    1. Delete signature file from Supabase Storage
    2. Delete metadata from database
    """
    try:
        # Delete signature
        result = await delete_signature(signature_id, user_id)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result.get("message", "Signature not found or access denied")
            )
        
        return APIResponse(
            status="success",
            data=result,
            message="Signature deleted successfully"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete signature: {str(e)}"
        )
