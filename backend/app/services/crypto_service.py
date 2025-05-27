import os
import hashlib
import base64
from oqs import Signature, KeyEncapsulation
from dotenv import load_dotenv

load_dotenv()

# Constants
DILITHIUM_ALG = "Dilithium2"
KYBER_ALG = "Kyber512"

async def generate_dilithium_keypair():
    """Generate a Dilithium2 keypair for post-quantum signatures.
    
    Returns:
        tuple: (private_key_base64, public_key_base64)
    """
    with Signature(DILITHIUM_ALG) as signer:
        public_key = signer.generate_keypair()
        private_key = signer.export_secret_key()
        
        # Encode as base64 for storage
        public_key_b64 = base64.b64encode(public_key).decode('utf-8')
        private_key_b64 = base64.b64encode(private_key).decode('utf-8')
        
        return private_key_b64, public_key_b64

async def sign_document_hash(document_hash: bytes, private_key_b64: str):
    """Sign a document hash using Dilithium2 private key.
    
    Args:
        document_hash: SHA3-256 hash of the document
        private_key_b64: Base64-encoded private key
        
    Returns:
        str: Base64-encoded signature
    """
    # Decode private key from base64
    private_key = base64.b64decode(private_key_b64)
    
    with Signature(DILITHIUM_ALG) as signer:
        signer.import_secret_key(private_key)
        signature = signer.sign(document_hash)
        
        # Encode signature as base64
        return base64.b64encode(signature).decode('utf-8')

async def verify_signature(document_hash: bytes, signature_b64: str, public_key_b64: str):
    """Verify a Dilithium2 signature.
    
    Args:
        document_hash: SHA3-256 hash of the document
        signature_b64: Base64-encoded signature
        public_key_b64: Base64-encoded public key
        
    Returns:
        bool: True if signature is valid, False otherwise
    """
    # Decode from base64
    signature = base64.b64decode(signature_b64)
    public_key = base64.b64decode(public_key_b64)
    
    with Signature(DILITHIUM_ALG) as verifier:
        try:
            verifier.verify(document_hash, signature, public_key)
            return True
        except Exception:
            return False

async def hash_document(file_content: bytes):
    """Create a SHA3-256 hash of a document.
    
    Args:
        file_content: Binary content of the file
        
    Returns:
        bytes: SHA3-256 hash
    """
    return hashlib.sha3_256(file_content).digest()

async def encrypt_session_data(data: str, recipient_public_key_b64: str = None):
    """Encrypt session data using Kyber for guest sessions.
    
    Args:
        data: Data to encrypt (typically a session ID or document URL)
        recipient_public_key_b64: Optional public key for recipient
        
    Returns:
        tuple: (ciphertext_b64, encapsulated_key_b64)
    """
    with KeyEncapsulation(KYBER_ALG) as kem:
        if recipient_public_key_b64:
            public_key = base64.b64decode(recipient_public_key_b64)
        else:
            public_key = kem.generate_keypair()
            
        ciphertext, shared_secret = kem.encap_secret(public_key)
        
        # Use shared secret to encrypt data
        # Simple XOR for demonstration (use a proper symmetric cipher in production)
        data_bytes = data.encode('utf-8')
        encrypted = bytes(a ^ b for a, b in zip(data_bytes, shared_secret * (len(data_bytes) // len(shared_secret) + 1)))
        
        return (base64.b64encode(encrypted).decode('utf-8'), 
                base64.b64encode(ciphertext).decode('utf-8'))

async def decrypt_session_data(ciphertext_b64: str, encapsulated_key_b64: str, private_key_b64: str):
    """Decrypt session data using Kyber.
    
    Args:
        ciphertext_b64: Base64-encoded encrypted data
        encapsulated_key_b64: Base64-encoded encapsulated key
        private_key_b64: Base64-encoded private key
        
    Returns:
        str: Decrypted data
    """
    ciphertext = base64.b64decode(ciphertext_b64)
    encapsulated_key = base64.b64decode(encapsulated_key_b64)
    private_key = base64.b64decode(private_key_b64)
    
    with KeyEncapsulation(KYBER_ALG) as kem:
        kem.import_secret_key(private_key)
        shared_secret = kem.decap_secret(encapsulated_key)
        
        # Decrypt using shared secret
        # Simple XOR for demonstration
        decrypted = bytes(a ^ b for a, b in zip(ciphertext, shared_secret * (len(ciphertext) // len(shared_secret) + 1)))
        
        return decrypted.decode('utf-8')
