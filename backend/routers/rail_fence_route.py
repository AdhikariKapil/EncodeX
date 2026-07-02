from fastapi import APIRouter, Query

from controllers.rail_fence_controller import (
    decrypt_rail_fence,
    encrypt_rail_fence,
    visualize_rail_fence,
)
from models.requests.rail_fence_request import RailFenceRequest
from models.responses.rail_fence_response import (
    RailFenceDecryptResponse,
    RailFenceEncryptResponse,
    RailFenceVisualizeResponse,
)

router = APIRouter(prefix="/api/rail-fence", tags=["Rail Fence Cipher"])


@router.post("/encrypt", response_model=RailFenceEncryptResponse)
async def encrypt_endpoint(request: RailFenceRequest):
    """Encrypt text using Rail Fence cipehr"""
    return await encrypt_rail_fence(request)


@router.post("/decrypt", response_model=RailFenceDecryptResponse)
async def decrypt_endpoint(request: RailFenceRequest):
    return await decrypt_rail_fence(request)


@router.get("/visualize", response_model=RailFenceVisualizeResponse)
async def visualize_endpoint(
    text: str = Query(..., min_length=1),
    rails: int = Query(..., ge=2, le=10),
    operation: str = Query("encrypt", regex="^(encryt|decrypt)$"),
):

    print(f"Received: text={text}, rails={rails}, operation={operation}")  # Debug
    return await visualize_rail_fence(text, rails, operation)
