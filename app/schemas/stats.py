from pydantic import BaseModel


class StatsSummary(BaseModel):
    date: str
    calories: int
    workout_count: int
    workout_duration: int
