from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

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


@app.exception_handler(Exception)
async def exception_handler(r: Request, e: Exception):
    return error_response('Server error, something went wrong')
