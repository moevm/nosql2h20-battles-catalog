import os

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .utils import mkdir, rmdir
from .views import router, error_response


def create_app():
    origins = [
        "http://localhost",
        "http://localhost:4200",
    ]

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    return app


app = create_app()


@app.on_event("startup")
async def startup_event():
    if os.path.exists(settings.TEMP_DIR):
        await rmdir(settings.TEMP_DIR)

    mkdir(settings.TEMP_DIR)


@app.on_event("shutdown")
async def shutdown_event():
    await rmdir(settings.TEMP_DIR)
    