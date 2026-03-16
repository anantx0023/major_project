const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const YOLO_SERVICE_URL = "http://localhost:8000/detect-all";
const ML_SERVICE_URL = "http://localhost:8001/predict";

async function trafficDecision(req, res) {
    try {
        const directions = ["north", "south", "east", "west"];
        for (const dir of directions) {
            if (!req.files[dir] || req.files[dir].length === 0) {
                return res.status(400).json({ error: `Missing file for direction: ${dir}` });
            }
        }

        // Send all 4 files to YOLO service
        const form = new FormData();
        for (const dir of directions) {
            const file = req.files[dir][0];
            form.append(dir, fs.createReadStream(file.path), file.originalname);
        }

        const yoloResponse = await axios.post(YOLO_SERVICE_URL, form, {
            headers: form.getHeaders(),
        });

        const counts = yoloResponse.data;

        // Send all 4 counts to ML service
        const mlResponse = await axios.post(ML_SERVICE_URL, {
            north: counts.north,
            south: counts.south,
            east: counts.east,
            west: counts.west,
        });

        const prediction = mlResponse.data;

        // Clean up uploaded files
        for (const dir of directions) {
            fs.unlinkSync(req.files[dir][0].path);
        }

        const directionDurations = {
            north_south: 45,
            east_west: 30,
        };

        res.json({
            vehicle_counts: counts,
            action: prediction.action,
            green_direction: prediction.green_direction,
            duration: directionDurations[prediction.green_direction] || 30,
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

module.exports = { trafficDecision };
