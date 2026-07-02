from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import auth_route, caesar_route, rail_fence_route, rsa_route


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Startup
    init_db()
    yield


app = FastAPI(
    title="EncodeX API",
    description="Educational ciphering techniques platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://encodex-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(caesar_route.router)
app.include_router(rail_fence_route.router)
app.include_router(rsa_route.router)
app.include_router(auth_route.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to EncodeX API",
        "status": "online",
        "available_ciphers": ["caesar", "rail_fence", "rsa"],
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
