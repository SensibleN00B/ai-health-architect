from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WorkoutBase(BaseModel):
    user_id: int
    description: str
    duration_minutes: int | None = None
    intensity: str | None = None
    activity_type: str | None = None
    metrics: dict[str, object] | None = None


class WorkoutCreate(WorkoutBase):
    pass


class WorkoutUpdate(BaseModel):
    description: str | None = None
    duration_minutes: int | None = None
    intensity: str | None = None
    activity_type: str | None = None
    metrics: dict[str, object] | None = None


class WorkoutResponse(WorkoutBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
