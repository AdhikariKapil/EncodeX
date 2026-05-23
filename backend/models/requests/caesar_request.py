from pydantic import BaseModel, Field, field_validator


class CaesarRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to encrypt")
    shift: int = Field(..., ge=1, le=25, description="Shift amount (1-25)")

    @field_validator("text")
    def text_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Text cannot be empty")

        return v


class CaesarBruteForceRequest(BaseModel):
    text: str = Field(..., min_length=1, description="CipherText to bruteforce")
