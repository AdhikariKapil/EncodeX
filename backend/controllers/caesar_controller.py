from os import stat
from fastapi import HTTPException, status
from services.caesar_service import caesar_encrypt, caesar_bruteforce, caesar_decrypt
from models.requests.caesar_request import (
    CaesarBruteForceRequest,
    CaesarRequest,
)
from models.responses.caesar_response import (
    CaesarBruteforceResponse,
    CaesarResponse,
    BruteforceResult,
    VisualizationStep,
    CaesarVisualizationResponse,
)


async def encrypt_caesar(request: CaesarRequest):
    """Controller for Caesar cipher encryption"""
    try:
        result = caesar_encrypt(request.text, request.shift)

        # Convert visualization dicts to Pydantic models
        visualization_steps = [
            VisualizationStep(**step) for step in result["visualization"]
        ]

        return CaesarResponse(
            original_text=request.text,
            shift_used=request.shift,
            ciphered_text=result["ciphered_text"],
            visualization_steps=visualization_steps,
            operation="encrypt",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Encryption failed: {str(e)}",
        )


async def decrypt_caesar(request: CaesarRequest):
    try:
        result = caesar_decrypt(request.text, request.shift)

        # Convert visualization dicts to pydantic models
        visualization_steps = [
            VisualizationStep(**step) for step in result["visualization"]
        ]

        return CaesarResponse(
            original_text=request.text,
            shift_used=request.shift,
            ciphered_text=result["ciphered_text"],
            visualization_steps=visualization_steps,
            operation="decrypt",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decryption failed: {str(e)}",
        )


async def bruteforce_caesar(request: CaesarBruteForceRequest):
    """Controller for Caesar cipher bruteforce"""
    try:
        results = caesar_bruteforce(request.text)

        bruteforce_result = [
            BruteforceResult(shift=r["shift"], decrypted_text=r["decrypted_text"])
            for r in results
        ]

        return CaesarBruteforceResponse(
            original_ciphertext=request.text,
            total_attempts=len(results),
            results=bruteforce_result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bruteforce failed: {str(e)}",
        )


async def visualize_caesar(text: str, shift: int):
    """Controller for Caesar cipher visualization (legacy GET endpoint)"""
    try:
        if shift < 1 or shift > 25:
            raise ValueError("Shift must be between 1 and 25")

        result = caesar_encrypt(text, shift)

        return CaesarVisualizationResponse(
            original_text=text,
            result_text=result["ciphered_text"],
            shift=shift,
            visualization_steps=result["visualization"],
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Visualization failed: {str(e)}",
        )
