# SignThatDoc: Next Steps

## 1. Environment Setup
- [ ] Create `.env` file in backend directory with the following variables:
  ```
  SUPABASE_URL=https://qbezozsekvnpqeycouwd.supabase.co
  SUPABASE_KEY=
  GEMINI_API_KEY=your_gemini_api_key
  ELEVENLABS_API_KEY=your_elevenlabs_api_key
  STRIPE_SECRET_KEY=your_stripe_secret_key
  STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
  STRIPE_CREATOR_PRICE_ID=your_stripe_creator_price_id
  STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
  STRIPE_PREMIUM_PRICE_ID=your_stripe_premium_price_id
  STRIPE_PAYG_PRICE_ID=your_stripe_payg_price_id
  SMTP_SERVER=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USERNAME=your_email
  SMTP_PASSWORD=your_app_password
  DEFAULT_FROM_EMAIL=your_email
  ```

## 2. Supabase Database Setup
- [ ] Enable and configure the pgvector extension in Supabase:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```
- [ ] Create tables in Supabase:
  ```sql
  -- User profiles table
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- User keys table for post-quantum cryptography
  CREATE TABLE IF NOT EXISTS user_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    public_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Documents table
  CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    is_signed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Signatures table
  CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    signature_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Subscriptions table
  CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT,
    plan_name TEXT NOT NULL,
    document_limit INTEGER NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Document embeddings for vector search (pgvector)
  CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents ON DELETE CASCADE NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, chunk_index)
  );

  -- Create index for vector similarity search
  CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  ```

## 3. Supabase Storage Setup
- [ ] Create the following storage buckets in Supabase:
  - [ ] `documents` - For storing uploaded documents
  - [ ] `signatures` - For storing user signatures
  - [ ] `signed_documents` - For storing documents after signing
  - [ ] `guest_signed` - For storing documents signed by guests

## 4. Update AI Service for pgvector
- [ ] Modify `ai_service.py` to use pgvector instead of ChromaDB:
  - [ ] Update `store_embeddings` function to insert into Supabase
  - [ ] Update `search_similar_chunks` function to query pgvector
  - [ ] Test embeddings storage and retrieval with real documents

## 5. Update Google AI Integration
- [ ] Update the AI service to use Google's latest multimodal model:
  - [ ] Update Gemini API client code
  - [ ] Enhance prompt engineering for better document understanding
  - [ ] Test with different document types (PDF, DOCX, etc.)

## 6. Frontend-Backend Integration
- [ ] Connect the Profile page to profile endpoints
  - [ ] Implement profile data retrieval
  - [ ] Handle profile updates
- [ ] Integrate the Pricing component with billing endpoints
  - [ ] Connect subscription buttons to checkout endpoints
  - [ ] Add payment success and cancel pages
- [ ] Connect document management UI:
  - [ ] Implement document upload functionality
  - [ ] Connect list documents endpoint to UI
  - [ ] Implement document deletion
- [ ] Connect signature management UI:
  - [ ] Implement signature creation/upload
  - [ ] Connect signature list endpoint
  - [ ] Implement signature deletion

## 7. Testing
- [ ] Test authentication flow (signup/login)
- [ ] Test document upload, list, and delete operations
- [ ] Test signature creation, application, and deletion
- [ ] Test document AI chat with pgvector
- [ ] Test voice interaction with documents
- [ ] Test guest signing flow
- [ ] Test email delivery
- [ ] Test subscription and payment flows
- [ ] Run end-to-end testing for complete user journeys

## 8. Security Audit
- [ ] Verify JWT validation
- [ ] Review private key handling on frontend
- [ ] Test post-quantum cryptography implementation
- [ ] Verify CORS settings
- [ ] Review permission controls in Supabase RLS

## 9. Performance Optimization
- [ ] Optimize document chunking and embedding
- [ ] Add caching for frequently accessed data
- [ ] Optimize AI query response times
- [ ] Measure and improve frontend performance

## 10. Deployment
- [ ] Choose deployment platform (Vercel, Netlify, etc.)
- [ ] Create Docker containers for backend
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment variables
- [ ] Set up monitoring and logging
- [ ] Deploy to staging for final testing
- [ ] Deploy to production

## 11. Documentation
- [ ] Create API documentation
- [ ] Write user guide
- [ ] Document setup and deployment process
