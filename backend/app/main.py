from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.analyze import router as analyze_router

app = FastAPI()

# ── CORS — allows frontend to talk to backend ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──
app.include_router(upload_router)
app.include_router(analyze_router)

@app.get("/")
def home():
    return {"message": "Backend running successfully"}

# ── Health check — frontend checks this ──
@app.get("/health")
def health():
    return {"status": "ok"}