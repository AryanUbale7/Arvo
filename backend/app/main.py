from fastapi import FastAPI

app = FastAPI(
    title="ARVO API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "ARVO API"
    }