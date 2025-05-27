from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from app.models import GuestLink, GuestSignature, APIResponse
from app.services.crypto_service import generate_dilithium_keypair, encrypt_session_data, sign_document_hash, hash_document
from app.services.supabase_service import download_file, upload_file, get_file_url
from app.routers.auth import get_current_user
from datetime import datetime, timedelta
import uuid
import json
import fitz  # PyMuPDF
import io
from PIL import Image
import base64
import os

router = APIRouter(tags=["Document Sharing"])

@router.post("/generate-link", response_model=APIResponse)
async def generate_share_link(
    document_id: str = Form(...),
    expiry_hours: int = Form(24),  # Default 24 hours
    user_id: str = Depends(get_current_user)
):
    """
    Generate a secure sharing link for guest signers:
    1. Create a unique session ID
    2. Encrypt session data using CRYSTALS-Kyber
    3. Return the encrypted link
    """
    try:
        # Create session data
        session_id = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=expiry_hours)
        
        # Data to encrypt
        session_data = json.dumps({
            "session_id": session_id,
            "document_id": document_id,
            "created_by": user_id,
            "expires_at": expires_at.isoformat()
        })
        
        # Encrypt with Kyber (no recipient public key, so we'll generate one)
        encrypted_data, encapsulated_key = await encrypt_session_data(session_data)
        
        # Store the session details in database (would typically be in a sessions table)
        # For this example, we'll just return the encrypted link
        
        # Create a sharing link format (in production would be a proper URL)
        sharing_link = f"{encrypted_data}:{encapsulated_key}"
        
        return APIResponse(
            status="success",
            data={
                "sharing_link": sharing_link,
                "expires_at": expires_at.isoformat(),
                "document_id": document_id
            },
            message="Secure sharing link generated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate sharing link: {str(e)}"
        )

@router.post("/guest-sign", response_model=APIResponse)
async def guest_sign_document(
    session_link: str = Form(...),
    signature_file: UploadFile = File(...),
    position_x: float = Form(...),
    position_y: float = Form(...),
    page_number: int = Form(1),
    guest_name: str = Form(...),
    guest_email: str = Form(None)
):
    """
    Apply a guest signature to a document:
    1. Decrypt the session link
    2. Verify session validity
    3. Apply visual signature
    4. Generate temporary Dilithium2 keys
    5. Sign the document cryptographically
    6. Store guest signer information
    """
    try:
        # Parse the session link
        # In a real implementation, this would involve decrypting with the server's Kyber private key
        # For this example, we'll simulate by parsing the link format
        encrypted_data, encapsulated_key = session_link.split(":")
        
        # In production, decrypt session data
        # session_data = await decrypt_session_data(encrypted_data, encapsulated_key, server_private_key)
        # session = json.loads(session_data)
        
        # For this example, we'll simulate with dummy data
        session = {
            "session_id": str(uuid.uuid4()),
            "document_id": "example_doc_id",
            "created_by": "original_user_id",
            "expires_at": (datetime.utcnow() + timedelta(hours=1)).isoformat()
        }
        
        # Check if session is expired
        expires_at = datetime.fromisoformat(session["expires_at"])
        if datetime.utcnow() > expires_at:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Signing session has expired"
            )
        
        # Read signature file
        signature_content = await signature_file.read()
        
        # Fetch document from storage
        document_path = f"documents/{session['document_id']}"
        document_content = await download_file("documents", document_path)
        
        # Create a PDF object
        pdf_document = fitz.open(stream=document_content, filetype="pdf")
        
        # Get the specified page
        page = pdf_document[page_number - 1]  # 0-indexed
        
        # Create an image object from signature content
        signature_image = Image.open(io.BytesIO(signature_content))
        
        # Convert image to PNG if it's not already
        if signature_image.format != "PNG":
            img_bytes = io.BytesIO()
            signature_image.save(img_bytes, format="PNG")
            img_bytes.seek(0)
            signature_content = img_bytes.read()
        
        # Insert signature image at the specified coordinates
        rect = fitz.Rect(position_x, position_y, 
                         position_x + 200, position_y + 100)  # Adjust size as needed
        page.insert_image(rect, stream=signature_content)
        
        # Save modified PDF to memory
        output_stream = io.BytesIO()
        pdf_document.save(output_stream)
        pdf_document.close()
        
        # Get the modified document content
        modified_document = output_stream.getvalue()
        
        # Hash the document
        document_hash = await hash_document(modified_document)
        
        # Generate temporary Dilithium2 keys for the guest
        guest_private_key, guest_public_key = await generate_dilithium_keypair()
        
        # Sign with guest's temporary key
        signature = await sign_document_hash(document_hash, guest_private_key)
        
        # Create signature metadata
        signature_metadata = {
            "signer": guest_name,
            "signer_email": guest_email,
            "timestamp": datetime.utcnow().isoformat(),
            "public_key": guest_public_key,
            "signature": signature,
            "hash_algorithm": "SHA3-256",
            "session_id": session["session_id"],
            "is_guest": True
        }
        
        # Upload the signed document
        signed_document_path = f"guest_signed/{session['document_id']}/{uuid.uuid4()}.pdf"
        await upload_file("documents", signed_document_path, modified_document, "application/pdf")
        
        # Get signed document URL
        signed_document_url = await get_file_url("documents", signed_document_path)
        
        return APIResponse(
            status="success",
            data={
                "signed_document_url": signed_document_url,
                "signature_metadata": signature_metadata,
                "guest_name": guest_name
            },
            message="Document signed by guest successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process guest signature: {str(e)}"
        )
