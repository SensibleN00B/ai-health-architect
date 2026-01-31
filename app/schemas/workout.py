from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class WorkoutBase(BaseModel):
    user_id: int
    description: str
    duration_minutes: Optional[int] = None
    intensity: Optional[str] = None
    activity_type: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutUpdate(BaseModel):
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    intensity: Optional[str] = None
    activity_type: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None

class WorkoutResponse(WorkoutBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
