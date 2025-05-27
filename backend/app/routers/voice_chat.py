from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from app.models import VoiceQuery, VoiceResponse, APIResponse
from app.services.ai_service import query_document
from app.routers.auth import get_current_user
import os
import io
import tempfile
import whisper
from elevenlabs import generate, save, set_api_key
from elevenlabs.api import Voice
from dotenv import load_dotenv
from typing import Optional
import base64

load_dotenv()

router = APIRouter(tags=["Voice Chat"])

# Initialize the Whisper model for speech recognition
whisper_model = whisper.load_model("base")

# Configure ElevenLabs
set_api_key(os.getenv("ELEVENLABS_API_KEY"))

@router.post("/ask", response_model=APIResponse)
async def voice_ask(
    document_id: str = Form(...),
    audio_file: UploadFile = File(...),
    voice_id: Optional[str] = Form("zcAOhNBS3c14rBihAFp9"),  # Default voice
    user_id: str = Depends(get_current_user)
):
    """
    Process voice question about a document:
    1. Accept audio input (WAV or MP3)
    2. Transcribe to text using Whisper
    3. Search document using RAG engine
    4. Generate Gemini AI reply
    5. Synthesize reply using ElevenLabs API
    6. Return both text and audio
    """
    try:
        # Read audio file content
        audio_content = await audio_file.read()
        
        # Save audio to a temporary file (Whisper requires a file path)
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_audio:
            temp_audio.write(audio_content)
            temp_audio_path = temp_audio.name
        
        try:
            # Transcribe audio to text using Whisper
            result = whisper_model.transcribe(temp_audio_path)
            transcribed_text = result["text"]
            
            # Query the document using the transcribed text
            query_result = await query_document(transcribed_text, document_id)
            text_response = query_result["answer"]
            
            # Generate audio response using ElevenLabs
            audio_response = generate(
                text=text_response,
                voice=Voice(voice_id=voice_id),
                model="eleven_monolingual_v1"
            )
            
            # Save audio to bytes
            audio_bytes = io.BytesIO()
            save(audio_response, audio_bytes)
            audio_bytes.seek(0)
            
            # Encode audio to base64 for response
            audio_base64 = base64.b64encode(audio_bytes.read()).decode('utf-8')
            
            return APIResponse(
                status="success",
                data={
                    "transcribed_question": transcribed_text,
                    "text_response": text_response,
                    "audio_response": audio_base64,
                    "source_chunks": query_result["source_chunks"]
                },
                message="Voice query processed successfully"
            )
        finally:
            # Clean up temporary file
            os.unlink(temp_audio_path)
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process voice query: {str(e)}"
        )
