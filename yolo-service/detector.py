from ultralytics import YOLO
import cv2

model = None

def load_yolo_model():
    global model
    model = YOLO("yolov8n.pt")
    print("YOLO model loaded successfully.")

VEHICLE_CLASSES = {2, 3, 5, 7}
# 2=car, 3=motorcycle, 5=bus, 7=truck (COCO class IDs)

def count_from_frame(frame) -> int:
    results = model(frame, verbose=False)
    count = 0
    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            if cls_id in VEHICLE_CLASSES:
                count += 1
    return count

def detect_vehicles(file_path: str) -> int:
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        # Not a video, treat as image
        results = model(file_path, verbose=False)
        count = 0
        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                if cls_id in VEHICLE_CLASSES:
                    count += 1
        return count

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    sample_interval = max(1, int(fps))  # sample 1 frame per second

    counts = []
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % sample_interval == 0:
            counts.append(count_from_frame(frame))
        frame_idx += 1

    cap.release()

    if not counts:
        return 0
    return max(counts)  # peak vehicle count across sampled frames
