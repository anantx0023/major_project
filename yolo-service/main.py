from fastapi import FastAPI, UploadFile, File
from typing import Optional
from detector import load_yolo_model, detect_vehicles
import shutil
import os
import uuid

app = FastAPI(title="YOLO Vehicle Detection Service")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
def startup():
    load_yolo_model()

def save_and_detect(file: UploadFile) -> int:
    ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    count = detect_vehicles(file_path)
    os.remove(file_path)
    return count

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    vehicle_count = save_and_detect(file)
    return {"vehicle_count": vehicle_count}

@app.post("/detect-all")
async def detect_all(
    north: UploadFile = File(...),
    south: UploadFile = File(...),
    east: UploadFile = File(...),
    west: UploadFile = File(...)
):
    north_count = save_and_detect(north)
    south_count = save_and_detect(south)
    east_count = save_and_detect(east)
    west_count = save_and_detect(west)

    return {
        "north": north_count,
        "south": south_count,
        "east": east_count,
        "west": west_count
    }
