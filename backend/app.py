import os
import json
import argparse
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, List
import httpx
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "completion_model.pkl")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

app = FastAPI(
    title="KARA Learning Intelligence Tool",
    description="AI-powered prediction of online course completion probability and dropout risk",
    version="1.0"
)

# CORS configuration - FIXED
# Allow your Vercel domain and development environments
ALLOWED_ORIGINS = [
    "https://kara-brown.vercel.app",  # Production domain (removed trailing slash)
    "http://localhost:3000",           # Local development
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Load model
model = None
try:
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}", exc_info=True)
    model = None

# Check Gemini API key
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY not found. Chatbot functionality will be disabled.")

class CourseData(BaseModel):
    TimeSpentOnCourse: float = Field(..., gt=0, description="Time spent on course in minutes")
    NumberOfVideosWatched: int = Field(..., ge=0)
    NumberOfQuizzesTaken: int = Field(..., ge=0)
    QuizScores: float = Field(..., ge=0, le=100)
    CompletionRate: float = Field(..., ge=0, le=100)
    CourseCategory: Literal["Programming", "Business", "Design", "Marketing", "Data Science", "Other"]
    DeviceType: Literal["Desktop", "Mobile", "Tablet"]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def root():
    return {
        "message": "KARA Learning Intelligence API",
        "status": "running",
        "version": "1.0",
        "endpoints": {
            "health": "/health (GET)",
            "predict": "/predict (POST)",
            "chat": "/chat (POST)"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "gemini_api_configured": bool(GEMINI_API_KEY)
    }

@app.post("/predict")
async def predict(data: CourseData):
    if model is None:
        raise HTTPException(status_code=503, detail="Prediction model is not loaded. Service unavailable.")
    
    try:
        input_df = pd.DataFrame([data.model_dump()])
        proba = model.predict_proba(input_df)[0]
        prediction = model.predict(input_df)[0]
        completion_prob = float(proba[1])
        
        return {
            "will_complete": bool(prediction),
            "completion_probability": round(completion_prob, 4),
            "dropout_risk": (
                "High" if completion_prob < 0.40 else
                "Medium" if completion_prob < 0.70 else
                "Low"
            ),
            "confidence": round(float(max(proba)), 4),
            "input_data": data.model_dump()
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Gemini API is not configured.")
    
    try:
        contents = []
        system_instruction = """You are KARA (Knowledge & Achievement Retention Assistant), an AI learning companion designed to help students succeed in their online courses.

Your role is to:
- Provide encouragement and motivation for learners
- Answer questions about course content and learning strategies
- Offer study tips and time management advice
- Help learners understand their progress and predictions
- Be supportive, friendly, and educational

Keep responses concise (2-3 paragraphs max) and actionable."""

        # Add system instruction
        contents.append({"role": "user", "parts": [{"text": system_instruction}]})
        contents.append({"role": "model", "parts": [{"text": "Understood! I'm KARA, your learning assistant. I'm here to help you succeed in your courses. How can I help you today?"}]})
        
        # Add conversation history (last 10 messages)
        for msg in request.history[-10:]:
            role = "user" if msg.role.lower() == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.content}]})
        
        # Add current message
        contents.append({"role": "user", "parts": [{"text": request.message}]})
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json={
                    "contents": contents,
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500
                    }
                }
            )
            response.raise_for_status()
            result = response.json()
            assistant_message = result["candidates"][0]["content"]["parts"][0]["text"]
            return ChatResponse(response=assistant_message)
    
    except httpx.HTTPStatusError as e:
        logger.error(f"Gemini API error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail="Gemini API error")
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)