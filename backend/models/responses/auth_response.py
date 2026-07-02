from pydantic import BaseModel


class RegisterResponse(BaseModel):
    message: str
    username: str
    algorithm: str
    hashed_password: str


class LoginResponse(BaseModel):
    message: str
    username: str
    success: bool


class UserResponse(BaseModel):
    id: int
    username: str
    password_hash: str
    algorithm: str
