from fastapi import HTTPException, status

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
    RSAStep,
    RSAVisualizeResponse,
)
from services.rsa_service import (
    generate_rsa_keypair,
    rsa_decrypt,
    rsa_encrypt,
    rsa_visualize,
)


async def generate_keys(request: RSAKeyGenRequest):
    try:
        result = generate_rsa_keypair(request.key_size)
        return RSAKeyGenResponse(
            public_key=result["public_key"],
            private_key=result["private_key"],
            key_size=request.key_size,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Key generation failed: {str(e)}",
        )


async def encrypt_rsa(request: RSAEncryptRequest):
    try:
        ciphertext = rsa_encrypt(request.plaintext, request.public_key)
        return RSAEncryptResponse(ciphertext=ciphertext)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Encryption failed: {str(e)}",
        )


async def decrypt_rsa(request: RSADecryptRequest):
    try:
        plaintext = rsa_decrypt(request.ciphertext, request.private_key)
        return RSADecryptResponse(plaintext=plaintext)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Decryption failed: {str(e)}",
        )


async def visualize_rsa(request: RSAVisualizeRequest):
    try:
        result = rsa_visualize(request.plaintext, request.public_key)
        steps = [RSAStep(**step) for step in result["steps"]]
        return RSAVisualizeResponse(
            plaintext=result["plaintext"],
            ciphertext=result["ciphertext"],
            steps=steps,
            public_key_info=result["public_key_info"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Visualization failed: {str(e)}",
        )
