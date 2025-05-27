import os
import re
from typing import List, Dict, Any
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize services
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
embedding_model = SentenceTransformer('BAAI/bge-base-en-v1.5')

# Initialize ChromaDB (vector database)
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("document_chunks")

async def extract_text_from_pdf(pdf_content: bytes) -> str:
    """
    Extract text content from a PDF document.
    """
    document = fitz.open(stream=pdf_content, filetype="pdf")
    text = ""
    
    for page_num in range(len(document)):
        page = document[page_num]
        text += page.get_text()
    
    document.close()
    return text

async def chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> List[str]:
    """
    Split text into chunks with specified size and overlap.
    Returns chunks with size between 500-700 tokens (approx chars).
    """
    if not text:
        return []
    
    # Clean text by removing extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Simple chunking by characters as a rough approximation of tokens
    chunks = []
    start = 0
    
    while start < len(text):
        # Get chunk with overlap
        end = min(start + chunk_size, len(text))
        
        # If not at the beginning, make sure we don't break in the middle of a word
        if start > 0 and end < len(text):
            # Try to find the end of a sentence for more natural breaks
            sentence_end = text.rfind('. ', start, end)
            if sentence_end != -1:
                end = sentence_end + 1  # Include the period
            else:
                # If no sentence end, find the last space
                last_space = text.rfind(' ', start, end)
                if last_space != -1:
                    end = last_space
        
        # Add the chunk
        chunks.append(text[start:end].strip())
        
        # Move the start pointer for the next chunk, incorporating overlap
        start = min(end, start + chunk_size - overlap)
    
    return chunks

async def generate_embeddings(chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings for text chunks using the specified model.
    """
    return embedding_model.encode(chunks).tolist()

async def store_embeddings(document_id: str, chunks: List[str], embeddings: List[List[float]]):
    """
    Store embeddings in ChromaDB vector database.
    """
    # Generate IDs for each chunk
    chunk_ids = [f"{document_id}_{i}" for i in range(len(chunks))]
    
    # Store embeddings in ChromaDB
    collection.add(
        embeddings=embeddings,
        documents=chunks,
        ids=chunk_ids,
        metadatas=[{"document_id": document_id, "chunk_index": i} for i in range(len(chunks))]
    )

async def search_similar_chunks(query: str, document_id: str, k: int = 3) -> List[str]:
    """
    Search for most similar chunks to a query.
    """
    # Generate embedding for the query
    query_embedding = embedding_model.encode(query).tolist()
    
    # Search for similar chunks in the vector database
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k,
        where={"document_id": document_id}
    )
    
    return results["documents"][0]  # First element since we only have one query

async def call_gemini_api(prompt: str) -> str:
    """
    Call Gemini API for text generation.
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

async def analyze_document(document_content: bytes, document_id: str):
    """
    Extract text from PDF, chunk it, generate embeddings, and store in vector DB.
    """
    # Extract text
    text = await extract_text_from_pdf(document_content)
    
    # Chunk text
    chunks = await chunk_text(text)
    
    # Generate embeddings
    embeddings = await generate_embeddings(chunks)
    
    # Store in vector database
    await store_embeddings(document_id, chunks, embeddings)
    
    return {
        "document_id": document_id,
        "chunk_count": len(chunks),
        "total_tokens": sum(len(chunk.split()) for chunk in chunks)  # Rough estimate
    }

async def query_document(query: str, document_id: str):
    """
    Query a document using RAG approach.
    """
    # Find relevant chunks
    similar_chunks = await search_similar_chunks(query, document_id)
    
    # Build prompt
    prompt = f"""
    Based on the following text from the document, answer this question:
    
    Question: {query}
    
    Document text:
    {' '.join(similar_chunks)}
    
    Provide a clear, concise answer based only on the information in the document. 
    If the answer is not available in the provided text, state that you don't have 
    enough information to answer accurately.
    """
    
    # Call Gemini API
    answer = await call_gemini_api(prompt)
    
    return {
        "answer": answer,
        "source_chunks": similar_chunks,
        "confidence": 0.95  # Placeholder - would be based on embedding distance
    }
