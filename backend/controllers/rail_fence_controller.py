from fastapi import HTTPException, status

from models.requests.rail_fence_request import RailFenceRequest
from models.responses.rail_fence_response import (
    RailContent,
    RailFenceDecryptResponse,
    RailFenceEncryptResponse,
    RailFenceVisualizeResponse,
    RailPosition,
    VisualRail,
)
from services.rail_fence_service import (
    rail_fence_decrypt,
    rail_fence_encrypt,
    rail_fence_visualize,
)


async def encrypt_rail_fence(request: RailFenceRequest):
    """Controller for Rail Fence encryption"""
    try:
        result = rail_fence_encrypt(request.text, request.rails)

        # Convert visual rails to response model
        visual_rails = [
            VisualRail(
                rail_number=vr["rail_number"],
                content=[RailContent(**item) for item in vr["content"]],
            )
            for vr in result["visual_rails"]
        ]

        positions = [RailPosition(**pos) for pos in result["positions"]]

        return RailFenceEncryptResponse(
            original_text=request.text,
            encrypted_text=result["encrypted_text"],
            rails_used=request.rails,
            visualization=result["visualization"],
            visual_rails=visual_rails,
            positions=positions,
            operation="encrypt",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Encryption failed: {str(e)}",
        )


async def decrypt_rail_fence(request: RailFenceRequest):
    """Controller for Rail Fence decryption"""
    try:
        result = rail_fence_decrypt(request.text, request.rails)

        # Convert visual rails to response model
        visual_rails = [
            VisualRail(
                rail_number=vr["rail_number"],
                content=[RailContent(**item) for item in vr["content"]],
            )
            for vr in result["visual_rails"]
        ]

        return RailFenceDecryptResponse(
            original_text=request.text,
            decrypted_text=result["decrypted_text"],
            rails_used=request.rails,
            visualization=result["visualization"],
            visual_rails=visual_rails,
            operation="decrypt",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Encryption failed: {str(e)}",
        )


async def visualize_rail_fence(text: str, rails: int, operation: str = "encrypt"):
    """Controller for Rail Fence Visualization"""
    try:
        if rails < 2 or rails > 10:
            raise ValueError("Rails must be between 2 and 10")

        result = rail_fence_visualize(text, rails, operation)

        visual_rails = [
            VisualRail(
                rail_number=vr["rail_number"],
                content=[RailContent(**item) for item in vr["content"]],
            )
            for vr in result["visual_rails"]
        ]
        return RailFenceVisualizeResponse(
            operation=result["operation"],
            original_text=result["original_text"],
            result_text=result["result_text"],
            rails=result["rails"],
            visual_rails=visual_rails,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Visualiztion failed: {str(e)}",
        )
