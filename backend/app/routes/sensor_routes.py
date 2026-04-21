from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.db.models import Alert, SensorReading
from app.schemas.sensor_schema import SensorReadingCreate, SensorReadingResponse

router = APIRouter(prefix="/sensor", tags=["sensor"])


@router.post("/", response_model=SensorReadingResponse)
def create_sensor_reading(
    payload: SensorReadingCreate,
    db: Session = Depends(get_db)
):
    record = SensorReading(
        device_id=payload.device_id,
        zone=payload.zone,
        temperature=payload.temperature,
        vibration=payload.vibration,
        timestamp=payload.timestamp or datetime.utcnow(),
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    alerts_to_create = []

    if record.temperature > 85:
        alerts_to_create.append(
            Alert(
                device_id=record.device_id,
                zone=record.zone,
                alert_type="HIGH_TEMPERATURE",
                message=f"Temperature too high: {record.temperature}",
                value = record.temperature,
                timestamp = record.timestamp,
            )
        )

    if record.vibration > 3:
        alerts_to_create.append(
            Alert(
                device_id=record.device_id,
                zone=record.zone,
                alert_type="HIGH_VIBRATION",
                message=f"Vibration too high: {record.vibration}",
                value=record.vibration,
                timestamp = record.timestamp,
            )
        )

    if alerts_to_create:
        db.add_all(alerts_to_create)
        db.commit()

    return record

@router.get("/", response_model=list[SensorReadingResponse])
def get_sensor_readings(db: Session = Depends(get_db)):
    return (
        db.query(SensorReading)
        .order_by(SensorReading.timestamp.desc())
        .all()
    )

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return (
        db.query(Alert)
        .order_by(Alert.timestamp.desc())
        .all()
    )

#Average temperature per machine
@router.get("/analytics/avg-temperature")
def avg_temperature(db: Session = Depends(get_db)):
    result = (
        db.query(
            SensorReading.device_id,
            func.avg(SensorReading.temperature).label("avg_temp")
        )
        .group_by(SensorReading.device_id)
        .all()
    )

    return[
        {"device_id": r.device_id, "avg_temperature": round(r.avg_temp, 2)}
        for r in result
    ]

#Average vibration per zone
@router.get("/analytics/alert-count")
def alert_count(db: Session = Depends(get_db)):
    result = (
        db.query(
            Alert.alert_type,
            func.count(Alert.id).label("count")
        )
        .group_by(Alert.alert_type)
        .all()
    )

    return [
        {"alert_type": r.alert_type, "count": r.count}
        for r in result
    ]

#Alert count by type
@router.get("/analytics/alert-count")
def alert_count(db: Session = Depends(get_db)):
    result = (
        db.query(
            Alert.alert_type,
            func.count(Alert.id).label("count")
        )
        .group_by(Alert.alert_type)
        .all()
    )

    return [
        {"alert_type": r.alert_type, "count": r.count}
        for r in result
    ]