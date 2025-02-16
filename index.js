const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// ✅ Configure CORS (Allow Specific Origins)
const allowedOrigins = ["http://localhost:8081"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow credentials if needed
}));

app.use(express.json());

// ✅ Hardcoded MySQL Database Configuration
const db = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12762989",
  password: "kGgrfBqrn2",
  database: "sql12762989",
  port: 3306,
});

// ✅ Handle MySQL Connection & Auto-Reconnect
const connectToDB = () => {
  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL Connection Failed:", err);
      setTimeout(connectToDB, 5000); // Try reconnecting after 5s
    } else {
      console.log("✅ MySQL Connected Successfully!");
    }
  });

  db.on("error", (err) => {
    console.error("❌ MySQL Error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("🔄 Reconnecting to MySQL...");
      connectToDB(); // Reconnect on connection loss
    }
  });
};

connectToDB();

// ✅ Route to Handle Proof of Payment Submission
app.post("/submit-payment", (req, res) => {
  const { h, acttime, actstatus } = req.body;

  // 🔹 Validate Input
  if (!h || !acttime || !actstatus) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  // 🔹 SQL Query to Insert Data
  const query = "INSERT INTO examinerusers (h, acttime, actstatus) VALUES (?, ?, ?)";
  db.query(query, [h, acttime, actstatus], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ success: false, error: "Database error." });
    }

    console.log("✅ Data Inserted:", result);
    res.json({ success: true, message: "Payment proof submitted successfully!" });
  });
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
