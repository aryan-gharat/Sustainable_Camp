const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE_PATH = path.join(DATA_DIR, "greencampus-db.json");

console.log("🌱 Initializing GreenCampus AI Pre-Backend Store...");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Check if we need to invoke typescript or build
console.log(`📁 Target Data Path: ${DB_FILE_PATH}`);
console.log("✅ Pre-Backend data directory verified.");
