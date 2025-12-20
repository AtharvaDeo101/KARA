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

# Load environment variables
load_dotenv()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "completion_model.pkl")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"

app = FastAPI(
    title="Learning Intelligence Tool",
    description="Predicts online course completion probability and dropout risk",
    version="1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        # Add your production domain here when deploying
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = joblib.load(MODEL_PATH)
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Failed to load model: {str(e)}")
    raise RuntimeError(f"Failed to load model: {str(e)}")

# Check Gemini API configuration
if GEMINI_API_KEY:
    print("✓ Gemini API key configured")
else:
    print("⚠ Gemini API key not found. Chatbot will not work.")
    print("  Set GEMINI_API_KEY in your .env file")

class CourseData(BaseModel):
    TimeSpentOnCourse: float = Field(..., gt=0)
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
        "message": "Learning Intelligence Tool API",
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
    gemini_configured = GEMINI_API_KEY is not None and len(GEMINI_API_KEY) > 0
    return {
        "status": "healthy",
        "model_loaded": True,
        "gemini_api_configured": gemini_configured
    }

@app.post("/predict")
async def predict(data: CourseData):
    try:
        input_df = pd.DataFrame([data.model_dump()])
        proba = model.predict_proba(input_df)[0]
        prediction = model.predict(input_df)[0]
        completion_prob = proba[1]

        result = {
            "will_complete": bool(prediction),
            "completion_probability": round(float(completion_prob), 4),
            "dropout_risk": (
                "High" if completion_prob < 0.40 else
                "Medium" if completion_prob < 0.70 else
                "Low"
            ),
            "confidence": round(float(max(proba)), 4),
            "input_data": data.model_dump()
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key not configured. Please set GEMINI_API_KEY in your .env file."
        )
    
    try:
        # Build Gemini conversation history
        contents = []

        # System instruction (Gemini doesn't have a direct "system" role, we put it first)
        system_instruction = """You are a helpful AI learning assistant for KARA, an AI-powered learning intelligence platform. 
Your role is to help users understand:

- Course completion predictions and dropout risk analysis
- How the AI model analyzes learner behavior (time spent, videos watched, quiz scores, completion rates, device types, course categories)
- Best practices for improving course completion rates
- Interpreting prediction results (completion probability, dropout risk levels: Low >70%, Medium 40-70%, High <40%)
- Understanding factors that influence learning outcomes

Key features of KARA platform:
- AI-powered predictions using machine learning (XGBoost classifier)
- Real-time dropout risk assessment
- Performance tracking across multiple metrics
- Support for various course categories: Programming, Business, Design, Marketing, Data Science, and Other
- Multi-device support: Desktop, Mobile, Tablet

Be friendly, concise, and focus on educational insights. If asked about technical details, explain them in simple terms.
Keep responses under 150 words unless more detail is specifically requested. Use clear examples when helpful.
If you don't know something specific about the platform, acknowledge it honestly."""

        # Add system instruction as the first message
        contents.append({
            "role": "user",
            "parts": [{"text": system_instruction}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Understood! I'm ready to help with KARA learning insights."}]
        })

        # Add conversation history (Gemini uses "user" and "model" roles)
        for msg in request.history[-10:]:
            role = "user" if msg.role == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.content}]
            })

        # Add current user message
        contents.append({
            "role": "user",
            "parts": [{"text": request.message}]
        })

        # Call Gemini API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": contents,
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500
                    }
                }
            )

            if response.status_code != 200:
                error_detail = response.text
                print(f"Gemini API Error: {error_detail}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Gemini API error: {error_detail}"
                )

            result = response.json()
            assistant_message = result["candidates"][0]["content"]["parts"][0]["text"]

            return ChatResponse(response=assistant_message)

    except httpx.TimeoutException:
        print("Gemini API request timed out")
        raise HTTPException(status_code=504, detail="Request to Gemini API timed out.")
    except httpx.HTTPError as e:
        print(f"HTTP error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# CLI mode remains unchanged
def run_cli():
    parser = argparse.ArgumentParser(description="Course Completion Predictor CLI")
    parser.add_argument("--json", type=str, help="JSON input string")
    parser.add_argument("--csv", type=str, help="Path to CSV file")
    args = parser.parse_args()

    if args.json:
        try:
            data_dict = json.loads(args.json)
            data = CourseData(**data_dict)
            input_df = pd.DataFrame([data.model_dump()])
            
            proba = model.predict_proba(input_df)[0]
            prediction = model.predict(input_df)[0]
            completion_prob = proba[1]
            
            result = {
                "will_complete": bool(prediction),
                "completion_probability": round(float(completion_prob), 4),
                "dropout_risk": (
                    "High" if completion_prob < 0.40 else
                    "Medium" if completion_prob < 0.70 else
                    "Low"
                ),
                "confidence": round(float(max(proba)), 4),
                "input_data": data.model_dump()
            }
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"Error: {e}")
    elif args.csv:
        try:
            df = pd.read_csv(args.csv)
            results = []
            for _, row in df.iterrows():
                data = CourseData(**row.to_dict())
                input_df = pd.DataFrame([data.model_dump()])
                
                proba = model.predict_proba(input_df)[0]
                prediction = model.predict(input_df)[0]
                completion_prob = proba[1]
                
                result = {
                    "will_complete": bool(prediction),
                    "completion_probability": round(float(completion_prob), 4),
                    "dropout_risk": (
                        "High" if completion_prob < 0.40 else
                        "Medium" if completion_prob < 0.70 else
                        "Low"
                    ),
                    "confidence": round(float(max(proba)), 4)
                }
                results.append(result)
            print(pd.DataFrame(results).to_string(index=False))
        except Exception as e:
            print(f"Error: {e}")
    else:
        parser.print_help()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        run_cli()
    else:
        print("🚀 KARA Learning")

        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)