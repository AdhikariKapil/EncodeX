from pydantic import BaseModel, Field, field_validator


class RailFenceRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to encrypt")
    rails: int = Field(..., ge=2, le=10, description="Number of rails (2, 10)")

    @field_validator("text")
    def text_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Text cannot be empty")
        return v
