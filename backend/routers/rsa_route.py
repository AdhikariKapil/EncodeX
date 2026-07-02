from fastapi import APIRouter

from controllers.rsa_controller import (
    decrypt_rsa,
    encrypt_rsa,
    generate_keys,
    visualize_rsa,
)
from models.requests.rsa_request import (
    RSADecryptRequest,
    RSAEncryptRequest,
    RSAKeyGenRequest,
    RSAVisualizeRequest,
)
from models.responses.rsa_response import (
    RSADecryptResponse,
    RSAEncryptResponse,
    RSAKeyGenResponse,
    RSAVisualizeResponse,
)

router = APIRouter(prefix="/api/rsa", tags=["RSA Encryption"])


@router.post("/generate-keys", response_model=RSAKeyGenResponse)
async def generate_keys_endpoint(request: RSAKeyGenRequest):
    """Generate RSA public/private key pair"""
    return await generate_keys(request)


@router.post("/encrypt", response_model=RSAEncryptResponse)
async def encrypt_endpoint(request: RSAEncryptRequest):
    """Encrypt a message using RSA public key"""
    return await encrypt_rsa(request)


@router.post("/decrypt", response_model=RSADecryptResponse)
async def decrypt_endpoint(request: RSADecryptRequest):
    """Decrypt a message using RSA private key"""
    return await decrypt_rsa(request)


@router.post("/visualize", response_model=RSAVisualizeResponse)
async def visualize_endpoint(request: RSAVisualizeRequest):
    """Get step-by-step visualization of RSA encryption"""
    return await visualize_rsa(request)
