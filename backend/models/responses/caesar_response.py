from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class VisualizationStep(BaseModel):
    """Single step in the cipher visualization"""

    original_char: str
    original_position: Optional[int]
    shift_amount: int
    new_position: Optional[int]
    new_char: str
    formula: str


class CaesarResponse(BaseModel):
    original_text: str
    shift_used: int
    ciphered_text: str
    operation: str = "encrypt" or "decrypt"
    visualization_steps: List[VisualizationStep]


class BruteforceResult(BaseModel):
    shift: int
    decrypted_text: str


class CaesarBruteforceResponse(BaseModel):
    original_ciphertext: str
    total_attempts: int
    results: List[BruteforceResult]


class CaesarVisualizationResponse(BaseModel):
    """Legacy response model - kept for backward compatibility"""

    original_text: str
    result_text: str
    shift: int
    visualization_step: List[Dict[str, Any]]
