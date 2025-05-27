from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.models import DocumentQuery, AIResponse, APIResponse
from app.services.ai_service import analyze_document, query_document
from app.services.supabase_service import download_file
from app.routers.auth import get_current_user
from typing import Optional
import os

router = APIRouter(tags=["AI Assistant"])

@router.post("/analyze-doc/{document_id}", response_model=APIResponse)
async def analyze_document_endpoint(
    document_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Analyze a document:
    1. Extract text from uploaded PDF using PyMuPDF
    2. Chunk text into 500-700 tokens per chunk
    3. Generate embeddings using bge-base-en-v1.5 model
    4. Save embeddings into vector database
    """
    try:
        # Fetch document from Storage
        document_path = f"documents/{document_id}"  # This is simplified, would typically look up the actual path
        document_content = await download_file("documents", document_path)
        
        # Analyze document (extract text, chunk, embed, store)
        analysis_result = await analyze_document(document_content, document_id)
        
        return APIResponse(
            status="success",
            data=analysis_result,
            message="Document analyzed and indexed successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze document: {str(e)}"
        )

@router.post("/ask", response_model=APIResponse)
async def ask_question(
    query: DocumentQuery,
    user_id: str = Depends(get_current_user)
):
    """
    Answer questions about a document using RAG:
    1. Accept user query and document ID
    2. Embed query, search vector DB for relevant chunks
    3. Compose prompt and call Gemini Pro API
    4. Return AI-generated answer
    """
    try:
        # Query the document
        query_result = await query_document(query.query, query.document_id)
        
        return APIResponse(
            status="success",
            data=query_result,
            message="Query processed successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}"
        )
