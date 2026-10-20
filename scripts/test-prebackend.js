const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_FILE = path.join(__dirname, "..", "data", "greencampus-db.json");

console.log("=================================================");
console.log("🧪 RUNNING PRE-BACKEND PERSISTENCE TEST SUITE");
console.log("=================================================\n");

// 1. Verify DB file exists
if (!fs.existsSync(DB_FILE)) {
  console.error("❌ greencampus-db.json file does not exist!");
  process.exit(1);
}

const rawBefore = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
console.log(`✅ Loaded existing database: ${rawBefore.users.length} users, ${rawBefore.buildings.length} buildings, ${rawBefore.studentReports.length} reports.`);

// 2. Test password hash verification
const testPassword = "green2026!";
const adminUser = rawBefore.users.find(u => u.email === "admin@greencampus.ai");
const isPassValid = bcrypt.compareSync(testPassword, adminUser.passwordHash);
if (!isPassValid) {
  console.error("❌ Admin password hash verification failed!");
  process.exit(1);
}
console.log("✅ Admin credentials verified with bcrypt.");

// 3. Test New User Creation & Persistence
const testEmail = `newstudent_${Date.now()}@greencampus.ai`;
const newUserId = `usr-${Date.now()}`;
const newHash = bcrypt.hashSync("secretPass123", 10);

rawBefore.users.push({
  id: newUserId,
  email: testEmail,
  name: "Alex Rivera",
  passwordHash: newHash,
  role: "STUDENT",
  department: "Clean Energy '28",
  studentId: "STU-99999",
  staffId: null,
  avatarUrl: null,
  isActive: true,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

rawBefore.profiles.push({
  id: `prof-${newUserId}`,
  userId: newUserId,
  bio: "Test student account",
  totalEcoPoints: 100,
  carbonSavedKg: 0,
  waterSavedLiters: 0,
  streakDays: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// 4. Test Student Report & Points
const newReportId = `rep-${Date.now()}`;
rawBefore.studentReports.push({
  id: newReportId,
  userId: newUserId,
  title: "Test Acoustic Sensor Resonance",
  category: "WATER_LEAK",
  description: "Test description for acoustic sensor test.",
  location: "Sub-basement Lab 2",
  buildingName: "Solar Science Complex",
  impactEstKgCo2: 25.0,
  proofUrl: null,
  status: "PENDING",
  pointsAwarded: 20,
  feedback: "Received",
  verifiedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Write to disk
fs.writeFileSync(DB_FILE, JSON.stringify(rawBefore, null, 2), "utf8");
console.log("💾 Flushed test entities to greencampus-db.json on disk.");

// 5. Reload from disk fresh to prove persistence
const rawAfter = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
const foundUser = rawAfter.users.find(u => u.email === testEmail);
const foundReport = rawAfter.studentReports.find(r => r.id === newReportId);

if (!foundUser || !foundReport) {
  console.error("❌ Persistence test failed: entity not found after reload!");
  process.exit(1);
}

// Verify password
const canLogin = bcrypt.compareSync("secretPass123", foundUser.passwordHash);
if (!canLogin) {
  console.error("❌ Password match failed for newly persisted user!");
  process.exit(1);
}

console.log(`✅ User '${foundUser.name}' (${foundUser.email}) successfully created & verified!`);
console.log(`✅ Report '${foundReport.title}' successfully persisted!`);
console.log(`✅ Password comparison passed 100% with bcrypt!`);
console.log(`📊 Total Users on Disk: ${rawAfter.users.length}`);
console.log(`📊 Total Reports on Disk: ${rawAfter.studentReports.length}`);

console.log("\n🎉 ALL PRE-BACKEND PERSISTENCE TESTS PASSED SUCCESSFULLY!");
