from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi_swagger import patch_fastapi
from contextlib import asynccontextmanager
from backend.database import create_db
from backend.routes import router
from backend.auth import router as auth_router
from backend.category_routes import router as category_router
import time


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield

app = FastAPI(
    title="Contact Manager API",
    description="Simple contact management with authentication",
    docs_url=None,
    swagger_ui_oauth2_redirect_url=None,
    redoc_url="/redoc",
    lifespan=lifespan
)


# ---- CORS Middleware ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Custom Logging Middleware ----
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round(time.time() - start, 3)
    print(
        f"[{request.method}] {request.url.path}"
        f" -> {response.status_code} ({duration}s)"
    )
    return response


patch_fastapi(app, docs_url="/swagger")

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(router)