import { api } from "../../lib/api";
import type {
  AlertCountItem,
  AlertItem,
  AvgTemperatureItem,
  AvgVibrationItem,
  SensorReading,
} from "../../types/api";

export async function fetchSensorReadings(): Promise<SensorReading[]> {
  const response = await api.get<SensorReading[]>("/sensor/");
  return response.data;
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const response = await api.get<AlertItem[]>("/sensor/alerts");
  return response.data;
}

export async function fetchAvgTemperature(): Promise<AvgTemperatureItem[]> {
  const response = await api.get<AvgTemperatureItem[]>(
    "/sensor/analytics/avg-temperature"
  );
  return response.data;
}

export async function fetchAvgVibration(): Promise<AvgVibrationItem[]> {
  const response = await api.get<AvgVibrationItem[]>(
    "/sensor/analytics/avg-vibration"
  );
  return response.data;
}

export async function fetchAlertCount(): Promise<AlertCountItem[]> {
  const response = await api.get<AlertCountItem[]>(
    "/sensor/analytics/alert-count"
  );
  return response.data;
}