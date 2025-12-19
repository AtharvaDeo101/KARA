from pydantic import BaseModel, Field
from typing import Optional

class CourseCompletionInput(BaseModel):
    TimeSpentOnCourse: float = Field(..., gt=0)
    NumberOfVideosWatched: int = Field(..., ge=0)
    NumberOfQuizzesTaken: int = Field(..., ge=0)
    QuizScores: float = Field(..., ge=0, le=100)
    CompletionRate: float = Field(..., ge=0, le=100)
    CourseCategory: str = Field(..., pattern="^(Programming|Business|Design|Marketing|Data Science|Other)$")
    DeviceType: str = Field(..., pattern="^(Desktop|Mobile|Tablet)$")

    class Config:
        json_schema_extra = {
            "example": {
                "TimeSpentOnCourse": 120.5,
                "NumberOfVideosWatched": 15,
                "NumberOfQuizzesTaken": 8,
                "QuizScores": 82.4,
                "CompletionRate": 75.0,
                "CourseCategory": "Programming",
                "DeviceType": "Desktop"
            }
        }