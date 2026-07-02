from typing import Any, Dict, List

from pydantic import BaseModel


class RSAKeyGenResponse(BaseModel):
    public_key: str
    private_key: str
    key_size: int


class RSAEncryptResponse(BaseModel):
    ciphertext: str
    operation: str = "encrypt"


class RSADecryptResponse(BaseModel):
    plaintext: str
    operation: str = "decrypt"


class RSAStep(BaseModel):
    step: int
    title: str
    description: str
    details: Dict[str, Any]


class RSAVisualizeResponse(BaseModel):
    plaintext: str
    ciphertext: str
    steps: List[RSAStep]
    public_key_info: Dict[str, Any]
