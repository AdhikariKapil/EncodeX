from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import caesar_route

app = FastAPI(
    title="EncodeX API",
    description="Collection of ciphering techniques.",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(caesar_route.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to EncodeX API",
        "status": "online",
        "available_cipher": [],
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
