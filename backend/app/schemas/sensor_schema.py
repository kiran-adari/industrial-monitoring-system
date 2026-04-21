from datetime import datetime
from pydantic import BaseModel


class SensorReadingCreate(BaseModel):
    device_id: str
    zone: str
    temperature: float
    vibration: float
    timestamp: datetime | None = None


class SensorReadingResponse(BaseModel):
    id: int
    device_id: str
    zone: str
    temperature: float
    vibration: float
    timestamp: datetime

    class Config:
        from_attributes = True