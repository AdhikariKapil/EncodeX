from fastapi import APIRouter

from controllers.auth_controller import list_users, login_user, register_user
from models.requests.auth_request import LoginRequest, RegisterRequest
from models.responses.auth_response import LoginResponse, RegisterResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=RegisterResponse)
async def register(request: RegisterRequest):
    return await register_user(request)


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    return await login_user(request)


@router.get("/users", response_model=list[UserResponse])
async def get_users():
    return await list_users()
