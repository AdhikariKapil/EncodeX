from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class RailPosition(BaseModel):
    char: str
    rail: int
    position: int
    direction: Optional[str] = None


class RailContent(BaseModel):
    char: str
    column: int


class VisualRail(BaseModel):
    rail_number: int
    content: List[RailContent]


class RailFenceEncryptResponse(BaseModel):
    original_text: str
    encrypted_text: str
    rails_used: int
    visualization: List[Dict[str, Any]]
    visual_rails: List[VisualRail]
    positions: List[RailPosition]
    operation: str = "encrypt"


class RailFenceDecryptResponse(BaseModel):
    original_text: str
    decrypted_text: str
    rails_used: int
    visualization: List[Dict[str, Any]]
    visual_rails: List[VisualRail]
    operation: str = "decrypt"


class RailFenceVisualizeResponse(BaseModel):
    operation: str
    original_text: str
    result_text: str
    rails: int
    visual_rails: List[VisualRail]
    positions: Optional[List[RailPosition]] = None
