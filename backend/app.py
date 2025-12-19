import os
import json
import argparse
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "completion_model.pkl")

app = FastAPI(
    title="Learning Intelligence Tool",
    description="Predicts online course completion probability and dropout risk",
    version="1.0"
)

try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {str(e)}")

class CourseData(BaseModel):
    TimeSpentOnCourse: float = Field(..., gt=0)
    NumberOfVideosWatched: int = Field(..., ge=0)
    NumberOfQuizzesTaken: int = Field(..., ge=0)
    QuizScores: float = Field(..., ge=0, le=100)
    CompletionRate: float = Field(..., ge=0, le=100)
    CourseCategory: Literal["Programming", "Business", "Design", "Marketing", "Data Science", "Other"]
    DeviceType: Literal["Desktop", "Mobile", "Tablet"]

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict(data: CourseData):
    try:
        input_df = pd.DataFrame([data.model_dump()])

        # Predict
        proba = model.predict_proba(input_df)[0]
        prediction = model.predict(input_df)[0]

        completion_prob = proba[1]  # Probability of class 1 (complete)

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

# CLI mode
def run_cli():
    parser = argparse.ArgumentParser(description="Course Completion Predictor CLI")
    parser.add_argument("--json", type=str, help="JSON input string")
    parser.add_argument("--csv", type=str, help="Path to CSV file")
    args = parser.parse_args()

    if args.json:
        try:
            data_dict = json.loads(args.json)
            data = CourseData(**data_dict)
            result = predict(data)
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"Error: {e}")
    elif args.csv:
        df = pd.read_csv(args.csv)
        results = []
        for _, row in df.iterrows():
            data = CourseData(**row.to_dict())
            result = predict(data)
            results.append(result)
        print(pd.DataFrame(results).to_string(index=False))
    else:
        parser.print_help()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        run_cli()
    else:
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)