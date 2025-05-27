from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Authentication models
class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: EmailStr
    access_token: str
    refresh_token: Optional[str] = None

# Document models
class DocumentUpload(BaseModel):
    file_name: str
    file_type: str
    file_url: str
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_url: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_signed: bool = False

class DocumentList(BaseModel):
    documents: List[DocumentResponse]

# Signature models
class SignatureStyle(BaseModel):
    user_id: str
    signature_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SignatureRequest(BaseModel):
    document_id: str
    position_x: float
    position_y: float
    page_number: int = 1

class SignatureResponse(BaseModel):
    signature_id: str
    document_id: str
    user_id: str
    timestamp: datetime
    signature_hash: str
    
# AI Assistant models
class DocumentQuery(BaseModel):
    document_id: str
    query: str

class AIResponse(BaseModel):
    answer: str
    confidence: float
    source_chunks: List[str]

# Voice Chat models
class VoiceQuery(BaseModel):
    document_id: str
    audio_data: bytes

class VoiceResponse(BaseModel):
    text_response: str
    audio_response: bytes

# Guest Signing models
class GuestLink(BaseModel):
    document_id: str
    encrypted_link: str
    expires_at: datetime

class GuestSignature(BaseModel):
    session_id: str
    document_id: str
    position_x: float
    position_y: float
    page_number: int = 1
    guest_name: str
    guest_email: Optional[EmailStr] = None

# Email models
class EmailRequest(BaseModel):
    document_id: str
    recipient_email: EmailStr
    subject: Optional[str] = None
    message: Optional[str] = None

# Standard API Response
class APIResponse(BaseModel):
    status: str
    data: Optional[dict] = None
    message: Optional[str] = None
