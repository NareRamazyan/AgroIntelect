import serial
import csv
import os
import time
import re

SERIAL_PORT = 'COM5'       # Change to your ESP32 port (check Device Manager)
BAUD_RATE   = 115200
CSV_PATH    = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sensor_data.csv')


def parse_sensor_block(block: str) -> dict | None:
    patterns = {
        'humidity':    r'Humidity\s*:\s*([\d.]+)',
        'temperature': r'Temperature\s*:\s*([\d.]+)',
        'ph':          r'pH\s*:\s*([\d.]+)',
        'N':           r'Nitrogen\s*:\s*([\d.]+)',
        'P':           r'Phosphorus\s*:\s*([\d.]+)',
        'K':           r'Potassium\s*:\s*([\d.]+)',
    }

    data = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, block)
        if match:
            data[key] = float(match.group(1))

    if len(data) == 6:
        data['rainfall'] = get_last_rainfall()
        return data
    return None

def get_last_rainfall() -> float:
    """Read rainfall from existing CSV or return a default."""
    try:
        with open(CSV_PATH, 'r') as f:
            rows = list(csv.DictReader(f))
            if rows:
                return float(rows[0].get('rainfall', 100.0))
    except Exception:
        pass
    return 100.0  # default rainfall if no CSV exists yet

def write_csv(data: dict):
    """Overwrite sensor_data.csv with the latest single row."""
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['N','P','K','temperature','humidity','ph','rainfall'])
        writer.writeheader()
        writer.writerow({
            'N':           data['N'],
            'P':           data['P'],
            'K':           data['K'],
            'temperature': data['temperature'],
            'humidity':    data['humidity'],
            'ph':          data['ph'],
            'rainfall':    data['rainfall'],
        })
    print(f"[CSV] Updated → N:{data['N']} P:{data['P']} K:{data['K']} "
          f"T:{data['temperature']} H:{data['humidity']} pH:{data['ph']} Rain:{data['rainfall']}")

def main():
    print(f"[INFO] Connecting to {SERIAL_PORT} at {BAUD_RATE} baud...")
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
        print(f"[INFO] Connected. Listening for sensor data...")
    except serial.SerialException as e:
        print(f"[ERROR] Could not open port {SERIAL_PORT}: {e}")
        print("[HINT] Check Device Manager for the correct COM port")
        return

    buffer = ""
    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                continue

            buffer += line + "\n"

            if '---------------------' in line:
                data = parse_sensor_block(buffer)
                if data:
                    write_csv(data)
                else:
                    print(f"[WARN] Incomplete block, skipping...")
                buffer = ""

        except serial.SerialException as e:
            print(f"[ERROR] Serial error: {e}")
            time.sleep(2)
        except KeyboardInterrupt:
            print("\n[INFO] Stopped by user.")
            break

    ser.close()

if __name__ == '__main__':
    main()