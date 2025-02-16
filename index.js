const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ CORS Headers (For Cross-Origin Requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ MySQL Database Configuration (HARD-CODED)
const db = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12762989",
  password: "kGgrfBqrn2",
  database: "sql12762989",
  port: 3306,
});

// ✅ Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    process.exit(1); // Exit if DB fails to connect
  }
  console.log("✅ MySQL Connected Successfully!");
});

// ✅ Route to handle Proof of Payment submission
app.post("/submit-payment", (req, res) => {
  const { h, acttime, actstatus } = req.body;

  // 🔹 Validate input (ensure no null values)
  if (!h || !acttime || !actstatus) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  // 🔹 SQL Query to Insert Data
  const query = "INSERT INTO examinerusers (h, acttime, actstatus) VALUES (?, ?, ?)";
  db.query(query, [h, acttime, actstatus], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      return res.status(500).json({ success: false, error: "Database error." });
    }

    console.log("✅ Data inserted successfully:", result);
    res.json({ success: true, message: "Payment proof submitted successfully!" });
  });
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
