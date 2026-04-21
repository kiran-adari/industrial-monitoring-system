export type SensorReading = {
  id: number;
  device_id: string;
  zone: string;
  temperature: number;
  vibration: number;
  timestamp: string;
};

export type AlertItem = {
  id: number;
  device_id: string;
  zone: string;
  alert_type: string;
  message: string;
  value: number;
  timestamp: string;
};

export type AvgTemperatureItem = {
  device_id: string;
  avg_temperature: number;
};

export type AvgVibrationItem = {
  zone: string;
  avg_vibration: number;
};

export type AlertCountItem = {
  alert_type: string;
  count: number;
};