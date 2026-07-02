import sqlite3

from fastapi import HTTPException

from database import get_db_connection
from models.requests.auth_request import LoginRequest, RegisterRequest
from models.responses.auth_response import LoginResponse, RegisterResponse, UserResponse
from services.auth_service import hash_password, verify_password


async def register_user(request: RegisterRequest):
    conn = get_db_connection()
    try:
        hashed = hash_password(request.password, request.algorithm)
        conn.execute(
            "INSERT INTO users (username, password_hash, algorithm) VALUES (?, ?, ?)",
            (request.username, hashed, request.algorithm),
        )
        conn.commit()
        return RegisterResponse(
            message="User registered successfully",
            username=request.username,
            algorithm=request.algorithm,
            hashed_password=hashed,
        )
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()


async def login_user(request: LoginRequest):
    conn = get_db_connection()
    user = conn.execute(
        "SELECT username, password_hash, algorithm FROM users WHERE username = ?",
        (request.username,),
    ).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    stored_hash = user["password_hash"]
    alg = user["algorithm"]
    if verify_password(request.password, stored_hash, alg):
        return LoginResponse(
            message="Login successful", username=request.username, success=True
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


async def list_users():
    conn = get_db_connection()
    users = conn.execute(
        "SELECT id, username, password_hash, algorithm FROM users"
    ).fetchall()
    conn.close()
    return [
        {
            "id": u["id"],
            "username": u["username"],
            "password_hash": u["password_hash"],
            "algorithm": u["algorithm"],
        }
        for u in users
    ]
