# Major Project — Testing Guide (4 Videos)

This file contains the exact commands we used to test your trained system with **4 videos** (North/South/East/West) and also how to see **YOLO bounding boxes**.

---

## 0) Your 4 video paths (example)

Use these paths (change only if your file names/locations change):

- **north**: `C:\Users\anant\Downloads\test_video_majoe_project1.mp4`
- **south**: `C:\Users\anant\Downloads\test_video_majoe_project2.mp4`
- **west**: `C:\Users\anant\Downloads\test_video_majoe_project3.mp4`
- **east**: `C:\Users\anant\Downloads\test_video_major_project4.mp4`

---

## 1) Run the full pipeline (Backend → YOLO → ML)

### 1.1 Start services (3 terminals)

#### A) Start YOLO service (FastAPI) — port `8000`

In a terminal:

```powershell
cd C:\Users\anant\Desktop\major_project\yolo-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### B) Start ML service (FastAPI) — port `8001`

In another terminal:

```powershell
cd C:\Users\anant\Desktop\major_project\ml-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

**Important (trained model):** the ML service loads a Stable-Baselines3 PPO model from `traffic_model`.
Typically, that means the file `traffic_model.zip` should exist inside the `ml-service` folder.

#### C) Start Backend service (Express) — port `3000`

In another terminal:

```powershell
cd C:\Users\anant\Desktop\major_project\backend-service
npm install
npm start
```

### 1.2 Send 4 videos to the backend (ONE command)

You can run this from **any folder** (you do NOT need to `cd` into the project). Just make sure the services are already running.

Copy-paste this single command:

```powershell
curl.exe -X POST "http://localhost:3000/traffic-decision" -F "north=@C:\Users\anant\Downloads\test_video_majoe_project1.mp4" -F "south=@C:\Users\anant\Downloads\test_video_majoe_project2.mp4" -F "east=@C:\Users\anant\Downloads\test_video_major_project4.mp4" -F "west=@C:\Users\anant\Downloads\test_video_majoe_project3.mp4"
```

### 1.3 Expected output format

You should get JSON like:

```json
{
  "vehicle_counts": {"north": 17, "south": 27, "east": 12, "west": 34},
  "action": 1,
  "green_direction": "east_west",
  "duration": 30
}
```

- `vehicle_counts` = YOLO vehicle counts for each direction
- `action` = ML model output
- `green_direction` = mapped from action (`0 -> north_south`, `1 -> east_west`)
- `duration` = backend duration rule

---

## 2) YOLO only (vehicle counts without the ML model)

This directly calls the YOLO service.

```powershell
curl.exe -X POST "http://localhost:8000/detect-all" -F "north=@C:\Users\anant\Downloads\test_video_majoe_project1.mp4" -F "south=@C:\Users\anant\Downloads\test_video_majoe_project2.mp4" -F "east=@C:\Users\anant\Downloads\test_video_major_project4.mp4" -F "west=@C:\Users\anant\Downloads\test_video_majoe_project3.mp4"
```

---

## 3) YOLO with bounding boxes (boxed output video)

Your `yolo-service` API currently returns **counts only**.
To visually see YOLO drawing **bounding boxes**, use Ultralytics prediction and it will save an annotated output video.

### 3.1 Recommended way (YOLO CLI)

Run from inside `yolo-service` (recommended):

```powershell
cd C:\Users\anant\Desktop\major_project\yolo-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then run **one command per video** (these are the 4 commands):

```powershell
yolo predict model=yolov8n.pt source="C:\Users\anant\Downloads\test_video_majoe_project1.mp4" save=True show=True classes=2,3,5,7
```

```powershell
yolo predict model=yolov8n.pt source="C:\Users\anant\Downloads\test_video_majoe_project2.mp4" save=True show=True classes=2,3,5,7
```

```powershell
yolo predict model=yolov8n.pt source="C:\Users\anant\Downloads\test_video_major_project4.mp4" save=True show=True classes=2,3,5,7
```

```powershell
yolo predict model=yolov8n.pt source="C:\Users\anant\Downloads\test_video_majoe_project3.mp4" save=True show=True classes=2,3,5,7
```

- `classes=2,3,5,7` filters to vehicles (car, motorcycle, bus, truck)

### 3.2 Where the boxed output video is saved

Look here:

- `C:\Users\anant\Desktop\major_project\yolo-service\runs\detect\predict\`

If you run multiple times, you may see `predict2`, `predict3`, etc.

### 3.3 If you get this error

If you see:

> `No module named ultralytics.__main__; 'ultralytics' is a package and cannot be directly executed`

That means **your environment doesn’t support** `python -m ultralytics ...`.
Use the `yolo predict ...` commands above instead.

### 3.4 Fallback if `yolo` is not recognized

If the `yolo` command is not found, run this instead (one video example):

```powershell
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt').predict(source=r'C:\Users\anant\Downloads\test_video_majoe_project1.mp4', save=True, show=True, classes=[2,3,5,7])"
```

---

## 4) How to get a video path (Windows)

- Open File Explorer
- Select the video file
- Hold **Shift** → Right-click → **Copy as path**
- Paste into the command after `@`
