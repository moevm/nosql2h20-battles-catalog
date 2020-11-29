import uvicorn

if __name__ == '__main__':
    uvicorn.run("backend.app:app", port=3030, reload=True)
