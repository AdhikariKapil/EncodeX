from fastapi import APIRouter, Query
from controllers.caesar_controller import (
    encrypt_caesar,
    decrypt_caesar,
    bruteforce_caesar,
    visualize_caesar,
)
from models.requests.caesar_request import CaesarBruteForceRequest, CaesarRequest
from models.responses.caesar_response import (
    CaesarResponse,
    CaesarBruteforceResponse,
    CaesarVisualizationResponse,
)

router = APIRouter(prefix="/api/caesar", tags=["Caesar Cipher"])


@router.post("/encrypt", response_model=CaesarResponse)
async def encryt_endpoint(request: CaesarRequest):
    """Encrypt text using Caesar cipher with visualization"""
    return await encrypt_caesar(request)


@router.post("/decrypt", response_model=CaesarResponse)
async def decrypt_endpoint(request: CaesarRequest):
    """Decrypt text using Caesar cipher with visualization"""
    return await decrypt_caesar(request)


@router.post("/bruteforce", response_model=CaesarBruteforceResponse)
async def bruteforce_endpoint(request: CaesarBruteForceRequest):
    """Bruteforce Caesar cipher (try all 25 shifts)"""
    return await bruteforce_caesar(request)


@router.get("/visualize", response_model=CaesarVisualizationResponse)
async def visualiztion_endpoint(
    text: str = Query(..., min_length=1), shift: int = Query(..., ge=1, le=25)
):
    """Get step-by-step visualiztion of Caesar cipher transformation (Get method)"""
    return await visualize_caesar(text, shift)
