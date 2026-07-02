from pydantic import BaseModel, Field


class RSAKeyGenRequest(BaseModel):
    key_size: int = Field(
        2048, ge=1024, le=4096, description="Key size in bits (1024-4096)"
    )


class RSAEncryptRequest(BaseModel):
    plaintext: str = Field(..., min_length=1, description="Text to encrypt")
    public_key: str = Field(..., description="PEM-encoded RSA public key")


class RSADecryptRequest(BaseModel):
    ciphertext: str = Field(..., min_length=1, description="Base64 encoded ciphertext")
    private_key: str = Field(..., description="PEM-encoded RSA private key")


class RSAVisualizeRequest(BaseModel):
    plaintext: str = Field(..., min_length=1, description="Text to visualize")
    public_key: str = Field(..., description="PEM-encoded RSA public key")
