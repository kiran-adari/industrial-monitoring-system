from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.db.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    vibration = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)