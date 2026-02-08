from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HealthLogBase(BaseModel):
    category: str
    description: str | None = None
    data: dict[str, object] | None = None
    photo_url: str | None = None


class HealthLogCreate(HealthLogBase):
    user_id: int


class HealthLogResponse(HealthLogBase):
    id: int
    user_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class WeightHistoryItem(BaseModel):
    date: str
    weight: float
