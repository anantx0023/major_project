from fastapi import FastAPI
from pydantic import BaseModel
from model_loader import load_model, predict

app = FastAPI(title="Traffic ML Prediction Service")

class TrafficInput(BaseModel):
    north: int
    south: int
    east: int
    west: int

@app.on_event("startup")
def startup():
    load_model()

@app.post("/predict")
def predict_signal(data: TrafficInput):
    action = predict(data.north, data.south, data.east, data.west)

    direction_map = {0: "north_south", 1: "east_west"}

    return {
        "action": action,
        "green_direction": direction_map[action]
    }
