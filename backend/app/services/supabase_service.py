import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, Dict, Any

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

async def register_user(email: str, password: str):
    """Register a new user with Supabase Auth."""
    return supabase.auth.sign_up({
        "email": email,
        "password": password,
    })

async def login_user(email: str, password: str):
    """Authenticate a user with Supabase Auth."""
    return supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

async def store_user_public_key(user_id: str, public_key: str):
    """Store the user's public key in the database."""
    return supabase.table("user_keys").insert({
        "user_id": user_id,
        "public_key": public_key
    }).execute()

async def get_user_public_key(user_id: str):
    """Retrieve a user's public key from the database."""
    response = supabase.table("user_keys").select("public_key").eq("user_id", user_id).execute()
    return response.data[0]["public_key"] if response.data else None

async def upload_file(bucket_name: str, file_path: str, file_content, content_type: str = None):
    """Upload a file to Supabase Storage."""
    return supabase.storage.from_(bucket_name).upload(file_path, file_content, content_type)

async def download_file(bucket_name: str, file_path: str):
    """Download a file from Supabase Storage."""
    return supabase.storage.from_(bucket_name).download(file_path)

async def get_file_url(bucket_name: str, file_path: str):
    """Get a public URL for a file in Supabase Storage."""
    return supabase.storage.from_(bucket_name).get_public_url(file_path)

async def fetch_user_documents(user_id: str):
    """Fetch documents metadata for a specific user."""
    return supabase.table("documents").select("*").eq("user_id", user_id).execute()

async def save_document_metadata(user_id: str, file_url: str, file_name: str, file_type: str):
    """Save document metadata to the database."""
    return supabase.table("documents").insert({
        "user_id": user_id,
        "file_url": file_url,
        "file_name": file_name,
        "file_type": file_type
    }).execute()

async def delete_document(document_id: str, user_id: str):
    """Delete a document from the database and storage."""
    # First get the document to retrieve the file path
    response = supabase.table("documents").select("*").eq("id", document_id).eq("user_id", user_id).execute()
    
    if not response.data:
        return {"success": False, "message": "Document not found or access denied"}
    
    document = response.data[0]
    file_url = document.get("file_url")
    
    # Extract file path from URL
    if file_url:
        file_path = file_url.split("/")[-1]
        # Delete from storage
        try:
            supabase.storage.from_("documents").remove([f"documents/{user_id}/{file_path}"])
        except Exception as e:
            # Log the error but continue with DB deletion
            print(f"Error deleting file: {str(e)}")
    
    # Delete from database
    delete_response = supabase.table("documents").delete().eq("id", document_id).eq("user_id", user_id).execute()
    
    return {"success": True, "deleted": delete_response.data}

async def fetch_user_signatures(user_id: str):
    """Fetch all saved signatures for a specific user."""
    return supabase.table("signatures").select("*").eq("user_id", user_id).execute()

async def delete_signature(signature_id: str, user_id: str):
    """Delete a signature from the database and storage."""
    # First get the signature to retrieve the file path
    response = supabase.table("signatures").select("*").eq("id", signature_id).eq("user_id", user_id).execute()
    
    if not response.data:
        return {"success": False, "message": "Signature not found or access denied"}
    
    signature = response.data[0]
    signature_url = signature.get("signature_url")
    
    # Extract file path from URL
    if signature_url:
        file_path = signature_url.split("/")[-1]
        # Delete from storage
        try:
            supabase.storage.from_("signatures").remove([f"signatures/{user_id}/{file_path}"])
        except Exception as e:
            # Log the error but continue with DB deletion
            print(f"Error deleting file: {str(e)}")
    
    # Delete from database
    delete_response = supabase.table("signatures").delete().eq("id", signature_id).eq("user_id", user_id).execute()
    
    return {"success": True, "deleted": delete_response.data}

async def get_user_profile(user_id: str) -> Dict[str, Any]:
    """Get user profile information."""
    # Get user info
    user_response = supabase.table("profiles").select("*").eq("id", user_id).execute()
    
    # If user doesn't exist in profiles table, return basic info
    if not user_response.data:
        user_auth = supabase.auth.admin.get_user(user_id)
        return {
            "email": user_auth.user.email,
            "full_name": None,
            "organization": None,
            "current_plan": "Free",
            "document_usage": {
                "used": 0,
                "limit": 3  # Free tier limit
            }
        }
    
    user_data = user_response.data[0]
    
    # Get document count
    doc_count_response = supabase.table("documents").select("id", count="exact").eq("user_id", user_id).execute()
    document_count = doc_count_response.count if hasattr(doc_count_response, 'count') else 0
    
    # Get plan info
    subscription_response = supabase.table("subscriptions").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
    
    current_plan = "Free"
    doc_limit = 3  # Default free tier
    
    if subscription_response.data:
        subscription = subscription_response.data[0]
        current_plan = subscription.get("plan_name", "Free")
        
        # Set document limit based on plan
        if current_plan == "Creator Plan":
            doc_limit = 10
        elif current_plan == "Pro Plan":
            doc_limit = 100
        elif current_plan == "Premium Plan":
            doc_limit = 250
    
    return {
        "email": user_data.get("email"),
        "full_name": user_data.get("full_name"),
        "organization": user_data.get("organization"),
        "current_plan": current_plan,
        "document_usage": {
            "used": document_count,
            "limit": doc_limit
        }
    }

async def update_user_profile(user_id: str, full_name: Optional[str] = None, organization: Optional[str] = None) -> Dict[str, Any]:
    """Update user profile information."""
    # Prepare update data
    update_data = {}
    
    if full_name is not None:
        update_data["full_name"] = full_name
        
    if organization is not None:
        update_data["organization"] = organization
    
    if not update_data:
        return {"success": False, "message": "No data to update"}
    
    # Check if profile exists
    profile_check = supabase.table("profiles").select("id").eq("id", user_id).execute()
    
    if not profile_check.data:
        # Profile doesn't exist, create it
        user_auth = supabase.auth.admin.get_user(user_id)
        update_data["id"] = user_id
        update_data["email"] = user_auth.user.email
        response = supabase.table("profiles").insert(update_data).execute()
    else:
        # Update existing profile
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
    
    return {
        "success": True,
        "updated_profile": response.data[0] if response.data else None
    }
