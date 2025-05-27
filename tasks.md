# Corrected Cursor Prompts for SignThatDoc Backend

---

## 1. Authentication Module

- **Prompt:** "Inside `routers/auth.py`, implement `/signup` endpoint: ✅
  - Accept email and password
  - Register with Supabase Auth
  - Generate Dilithium2 keypair using oqs-python
  - Store public key in database."

- **Prompt:** "Inside `routers/auth.py`, implement `/login` endpoint: ✅
  - Accept email and password
  - Authenticate via Supabase Auth
  - Return JWT access token."

- **Prompt:** "Create JWT auth middleware to: ✅
  - Validate Supabase JWTs
  - Attach `user_id` to request.state inside `routers/auth.py` or as middleware."

---

## 2. Document Upload and Management

- **Prompt:** "Inside `routers/documents.py`, implement `/upload` endpoint: ✅
  - Accept PDF/DOCX/TXT file upload
  - Upload file to Supabase Storage
  - Save document metadata (user_id, file_url, timestamps) to database."

- **Prompt:** "Inside `routers/documents.py`, implement `/list` endpoint: ✅
  - List all documents uploaded by the authenticated user."

---

## 3. Signature Management

- **Prompt:** "Inside `routers/signatures.py`, implement `/save-style` endpoint: ✅
  - Accept signature file (SVG/PNG)
  - Upload to Supabase Storage and link to user profile."

- **Prompt:** "Inside `routers/signatures.py`, implement `/apply-signature` endpoint: ✅
  - Fetch document from Storage
  - Overlay visual signature at given coordinates
  - Hash the document (SHA3-256)
  - Sign the hash using user's Dilithium2 private key
  - Embed signature metadata into PDF."

---

## 4. AI Contract Assistant (RAG)

- **Prompt:** "Inside `routers/assistant.py`, implement `/analyze-doc` endpoint: ✅
  - Extract text from uploaded PDF using PyMuPDF
  - Chunk text into 500-700 tokens per chunk
  - Generate embeddings using `bge-base-en-v1.5` model
  - Save embeddings into vector database."

- **Prompt:** "Inside `routers/assistant.py`, implement `/ask` endpoint: ✅
  - Accept user query and document ID
  - Embed query, search vector DB for relevant chunks
  - Compose prompt and call Gemini Pro API
  - Return AI-generated answer."

---

## 5. Voice Interaction with Document

- **Prompt:** "Inside `routers/voice_chat.py`, implement `/ask` endpoint: ✅
  - Accept audio input (WAV or MP3)
  - Transcribe to text using Whisper or Gemini Speech-to-Text
  - Search document using RAG engine
  - Generate Gemini AI reply
  - Synthesize reply using ElevenLabs API
  - Return both text and audio."

---

## 6. Secure Guest Signing

- **Prompt:** "Inside `routers/share.py`, implement `/generate-link` endpoint: ✅
  - Generate Kyber-encrypted link containing session and document ID."

- **Prompt:** "Inside `routers/share.py`, implement `/guest-sign` endpoint: ✅
  - Accept guest signature (drawn signature file + coordinates)
  - Apply signature to document visually and cryptographically using temporary Dilithium2 keys
  - Save guest signer information and audit trail."

---

## 7. Email Sending Module

- **Prompt:** "Inside `routers/email.py`, implement `/send-signed-document` endpoint: ✅
  - Fetch signed document from Storage
  - Send the document to recipient email via SMTP or Gmail API."

---

## 8. Utility Services

- **Prompt:** "Inside `services/supabase_service.py`, implement helper functions: ✅
  - Upload file
  - Download file
  - Fetch user/document data."

- **Prompt:** "Inside `services/crypto_service.py`, implement helper functions: ✅
  - Generate Dilithium2 keypairs
  - Sign PDF hashes
  - Encrypt guest sessions using Kyber."

- **Prompt:** "Inside `services/ai_service.py`, implement helper functions: ✅
  - Chunk and embed text
  - Search vector database
  - Call Gemini API for AI answers."

- **Prompt:** "Inside `services/email_service.py`, implement helper functions: ✅
  - Send emails with attachments via SMTP or Gmail API."

---

# General Cursor Reminder

**When giving any prompt:**
- Do not create new folders or files.
- Work inside existing router or service files.
- Follow modular FastAPI structure.
- Validate JWTs on protected routes.
- Apply PQC digital signatures after visual signature.
- Embed signature metadata inside PDFs.
- Use async/await properly.
- Keep code clean, typed, and production-grade.

---

