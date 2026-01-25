from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger, Text, JSON
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False, index=True)
    username = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Integer, nullable=True)
    goal = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=True)
    calories = Column(Float, nullable=True)
    macros = Column(JSON, nullable=True)
    photo_url = Column(String(500), nullable=True)


class Workout(Base):
    __tablename__ = "workouts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=False)
    duration_minutes = Column(Integer, nullable=True)
    intensity = Column(String(20), nullable=True)
    activity_type = Column(String(50), nullable=True)
    metrics = Column(JSON, nullable=True)


class HealthLog(Base):
    __tablename__ = "health_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    data = Column(JSON, nullable=True)
    photo_url = Column(String(500), nullable=True)
