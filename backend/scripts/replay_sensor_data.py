import time
from pathlib import Path

import pandas as pd
import requests

API_URL = "http://127.0.0.1:8000/sensor/"
CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "sensor_replay.csv"
DELAY_SECONDS = 1

def load_sensor_data(csv_path):
    return pd.read_csv(csv_path)

def send_row_to_api(row):
    payload = {
        "device_id": row["device_id"],
        "zone": row["zone"],
        "temperature": float(row["temperature"]),
        "vibration": float(row["vibration"]),
        "timestamp": row["timestamp"],
    }

    response = requests.post(API_URL, json=payload)

    if response.status_code == 200:
        print("Sent:", payload)
    else:
        print("Failed:", response.text)

def replay():
    df = load_sensor_data(CSV_PATH)

    print("Starting replay...\n")

    for _, row in df.iterrows():
        send_row_to_api(row)
        time.sleep(DELAY_SECONDS)

    print("\nReplay completed.\n")

if __name__ == "__main__":
    replay()