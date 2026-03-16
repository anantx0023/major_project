from stable_baselines3 import PPO
import numpy as np

model = None

def load_model():
    global model
    model = PPO.load("traffic_model")
    print("Model loaded successfully.")

def predict(north, south, east, west):
    state = np.array([north, south, east, west], dtype=np.float32)
    action, _ = model.predict(state, deterministic=True)
    return int(action)
