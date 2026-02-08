from typing import TypedDict


class StatsSummaryItem(TypedDict):
    date: str
    calories: int
    workout_count: int
    workout_duration: int


class WeightHistoryItem(TypedDict):
    date: str
    weight: float
