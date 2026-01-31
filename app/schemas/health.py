from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class HealthLogBase(BaseModel):
    category: str
    description: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    photo_url: Optional[str] = None

class HealthLogCreate(HealthLogBase):
    user_id: int

class HealthLogResponse(HealthLogBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
