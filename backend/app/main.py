# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, documents, signatures, assistant, share, voice_chat, email, profile, billing
from app.routers.auth import JWTMiddleware

app = FastAPI(title="SignThatDoc API", 
              description="API for secure document signing with post-quantum cryptography",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add JWT middleware
app.add_middleware(JWTMiddleware)

# Include all routers
app.include_router(auth.router, prefix="/auth")
app.include_router(documents.router, prefix="/documents")
app.include_router(signatures.router, prefix="/signatures")
app.include_router(assistant.router, prefix="/assistant")
app.include_router(share.router, prefix="/share")
app.include_router(voice_chat.router, prefix="/voice_chat")
app.include_router(email.router, prefix="/email")
app.include_router(profile.router, prefix="/profile")
app.include_router(billing.router, prefix="/billing")

@app.get("/")
def read_root():
    return {"message": "SignThatDoc API running 🚀"}
