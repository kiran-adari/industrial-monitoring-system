def generate_alerts(sensor_data):
    alerts = []
    
    if sensor_data.temperature > 35:
        alerts.append({
            "alert_type": "warning",
            "message": f"High temperature detected in {sensor_data.zone}",
            "value": sensor_data.temperature
        })
        
    if sensor_data.vibration > 0.8:
        alerts.append({
            "alert_type": "critical",
            "message": f"High vibration detected in {sensor_data.zone}",
            "value": sensor_data.vibration
        })
        
    return alerts