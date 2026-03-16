# AI-Based Intelligent Traffic Signal Optimization System

## Full Technical Specification and Implementation Guide

---

# 1. Project Overview

## Objective

Build an AI-based traffic signal optimization system that:

* Detects vehicle count using a YOLO-based computer vision service
* Uses a Reinforcement Learning model trained with SUMO simulation and Stable-Baselines3
* Predicts optimal signal direction and timing in real time
* Exposes ML and detection functionality via microservices
* Provides simulation and real-world compatibility

---

# 2. High-Level Architecture

System consists of 4 main services:

1. YOLO Detection Service
2. Reinforcement Learning ML Service
3. Backend Orchestration Service
4. SUMO Simulation Environment (Training only)

---

Architecture Diagram:

```
                TRAINING PHASE

            SUMO Simulator
                 │
                 ▼
         RL Training Service
        (Stable-Baselines3)
                 │
                 ▼
           traffic_model.zip



                INFERENCE PHASE

Camera/Video
     │
     ▼
YOLO Detection Service
     │
     ▼
Vehicle Count JSON
     │
     ▼
ML Prediction Service
     │
     ▼
Backend Service
     │
     ▼
Traffic Signal Decision / Dashboard
```

---

# 3. Technology Stack

## AI / ML

Python 3.10+

Stable-Baselines3
SUMO Simulator
TraCI API
Gymnasium

---

## Computer Vision

Python
YOLOv8 (Ultralytics)
OpenCV
FastAPI

---

## Backend

Node.js
Express.js

---

## Frontend (optional dashboard)

React.js
Chart.js

---

## Communication

REST APIs using JSON

---

# 4. Folder Structure

```
traffic-system/

├── yolo-service/
│   ├── main.py
│   ├── detector.py
│   ├── requirements.txt
│
├── ml-service/
│   ├── main.py
│   ├── model_loader.py
│   ├── traffic_model.zip
│   ├── requirements.txt
│
├── training/
│   ├── train.py
│   ├── traffic_env.py
│   ├── sumo_config/
│
├── backend-service/
│   ├── server.js
│   ├── routes.js
│
└── frontend/
```

---

# 5. SUMO Training Environment Specification

Purpose: Train reinforcement learning model using simulated real-time traffic.

State representation:

```
state = [
  north_vehicle_count,
  south_vehicle_count,
  east_vehicle_count,
  west_vehicle_count
]
```

Action space:

```
0 → North Green
1 → South Green
2 → East Green
3 → West Green
```

Reward function:

```
reward = -total_waiting_time
```

Goal:

Minimize total waiting time.

---

# 6. Reinforcement Learning Training Specification

File: training/train.py

Training algorithm:

PPO (Proximal Policy Optimization)

Training parameters:

```
learning_rate = 0.0003
timesteps = 100000
batch_size = 64
n_steps = 256
```

Output file:

```
traffic_model.zip
```

This file will be used in ML Service.

---

# 7. ML Prediction Service Specification

Purpose:

Load trained model and predict optimal signal.

Framework:

FastAPI

Endpoint:

POST /predict

Input JSON:

```
{
  "north": 45,
  "south": 20,
  "east": 10,
  "west": 5
}
```

Output JSON:

```
{
  "action": 0
}
```

Meaning:

0 = north green

---

ML Service Responsibilities:

* Load traffic_model.zip
* Accept vehicle counts
* Predict best signal direction
* Return prediction

---

# 8. YOLO Detection Service Specification

Purpose:

Accept video and return vehicle count.

Framework:

FastAPI

Model:

YOLOv8 pretrained model

Endpoint:

POST /detect

Input:

Video file

Output:

```
{
  "vehicle_count": 45
}
```

---

YOLO Service Responsibilities:

* Load YOLO model once
* Accept video frame or file
* Detect vehicles
* Return count

---

# 9. Backend Service Specification

Purpose:

Connect YOLO and ML services.

Flow:

```
Video → YOLO Service → count
Count → ML Service → prediction
Prediction → return to client
```

Framework:

Node.js + Express

Endpoint:

POST /traffic-decision

---

# 10. Real-Time Inference Flow

Loop:

```
while True:

  vehicle_count = YOLO.detect(video)

  prediction = ML.predict(vehicle_count)

  apply_signal(prediction)

  wait 5 seconds
```

---

# 11. Training Workflow

Steps:

1. Start SUMO simulation
2. Connect using TraCI
3. Read vehicle counts
4. Send state to RL model
5. Model selects action
6. Apply action in SUMO
7. Calculate reward
8. Train model
9. Save trained model

---

# 12. Deployment Workflow

Step 1:

Train model

Output:

```
traffic_model.zip
```

Step 2:

Place model in:

```
ml-service/
```

Step 3:

Start services:

```
YOLO service
ML service
Backend service
```

---

# 13. API Communication Specification

YOLO → ML

```
POST /predict

{
  "north": int,
  "south": int,
  "east": int,
  "west": int
}
```

Response:

```
{
  "action": int
}
```

---

# 14. Scalability Design

Services are independent.

Can scale:

* Multiple YOLO instances
* Multiple ML instances
* Load balancing possible

---

# 15. Real-World Compatibility

Training source:

SUMO simulation

Production source:

YOLO camera input

Model works with both.

---

# 16. Performance Goal

Target:

Reduce waiting time by 10–30%

---

# 17. Requirements Files

YOLO Service:

```
ultralytics
opencv-python
fastapi
uvicorn
```

ML Service:

```
stable-baselines3
gymnasium
fastapi
numpy
```

Training:

```
stable-baselines3
gymnasium
sumolib
traci
numpy
```

---

# 18. Expected Final Output

System accepts video and outputs:

```
{
  "green_direction": "north",
  "duration": 45
}
```

---

# 19. Development Order

Implement in this order:

Step 1: SUMO Training
Step 2: ML Service
Step 3: YOLO Service
Step 4: Backend Service
Step 5: Integration

---

# 20. Definition of Done

Project is complete when:

* Model trained using SUMO
* YOLO detects vehicles from video
* ML predicts optimal signal
* Backend integrates services
* System works end-to-end

---

# 21. Running Commands

## Virtual Environment Commands (Python services)

Activate venv (PowerShell):

```
.\venv\Scripts\Activate.ps1
```

Activate venv (CMD):

```
.\venv\Scripts\activate.bat
```

Deactivate venv:

```
deactivate
```

---

## Training Service

```
cd training
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
deactivate
```

Output: traffic_model.zip

---

## ML Service (Port 8001)

```
cd ml-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --port 8001
deactivate
```

Endpoint: POST http://localhost:8001/predict

---

## YOLO Service (Port 8000)

```
cd yolo-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --port 8000
deactivate
```

Endpoint: POST http://localhost:8000/detect

---

## Backend Service (Port 3000)

```
cd backend-service
npm install
npm start
```

Endpoint: POST http://localhost:3000/traffic-decision

---

## Run All Services (3 separate terminals)

Terminal 1:

```
cd ml-service
.\venv\Scripts\Activate.ps1
uvicorn main:app --port 8001
```

Terminal 2:

```
cd yolo-service
.\venv\Scripts\Activate.ps1
uvicorn main:app --port 8000
```

Terminal 3:

```
cd backend-service
npm start
```