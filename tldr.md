# SignThatDoc: Post-Quantum Document Signing Platform

## Overview
SignThatDoc is a comprehensive document management and e-signature platform built with post-quantum cryptography at its core. The application allows users to upload documents, chat with them using AI, sign them securely, and share them with guests for signatures.

## Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Pages**:
  - Landing page (`/`)
  - Authentication (Sign In/Sign Up)
  - Dashboard for document management
  - Enterprise plan info

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT via Supabase Auth
- **AI**: Google Gemini Pro API with RAG
- **Voice**: Whisper (transcription), ElevenLabs (synthesis)
- **Email**: SMTP integration

## Core Features

### Authentication
- Secure signup/login with Supabase Auth
- JWT middleware for protected routes
- Post-quantum keypair generation (CRYSTALS-Dilithium)

### Document Management
- Upload PDF/DOCX/TXT documents
- List user's documents
- Delete documents

### Signature Management
- Save signature styles (SVG/PNG)
- Apply visual signatures to documents
- Sign documents cryptographically using CRYSTALS-Dilithium
- List saved signatures
- Delete signatures

### AI Document Assistant
- Extract text from PDFs
- Chunk and embed document text (BGE embeddings)
- Store embeddings in vector database
- Question-answering with RAG approach using Gemini Pro API

### Voice Interaction
- Accept audio input (WAV/MP3)
- Transcribe with Whisper
- Process queries against documents
- Generate AI responses with Gemini
- Synthesize audio responses with ElevenLabs

### Secure Guest Signing
- Generate secure sharing links encrypted with CRYSTALS-Kyber
- Allow guests to sign documents without registration
- Verify signatures cryptographically

### Email Integration
- Send signed documents via email
- Customizable messages
- Attachment handling

### Profile Management
- View user profile (name, organization, email)
- Check subscription plan and document usage
- Update profile information

### Pricing and Billing
- Multiple subscription plans (Creator, Pro, Premium)
- Pay-as-you-go option
- Stripe integration for payments
- Webhook handling for subscription events

## Security Features
- Post-quantum cryptographic signatures using CRYSTALS-Dilithium
- Post-quantum key encapsulation with CRYSTALS-Kyber
- Document hashing (SHA3-256)
- JWT authentication
- Secure storage of cryptographic keys

## Technical Implementation
- Modular FastAPI architecture with separate routers and services
- React frontend with component-based architecture
- Full TypeScript support
- Integration with multiple third-party APIs
- Asynchronous API endpoints
- Proper error handling and response standardization
