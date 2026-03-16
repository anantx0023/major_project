const express = require("express");
const multer = require("multer");
const routes = require("./routes");

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ dest: "uploads/" });

const uploadFields = upload.fields([
    { name: "north", maxCount: 1 },
    { name: "south", maxCount: 1 },
    { name: "east", maxCount: 1 },
    { name: "west", maxCount: 1 }
]);

app.post("/traffic-decision", uploadFields, routes.trafficDecision);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Backend service running on http://localhost:${PORT}`);
});
