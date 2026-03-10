require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const registerRoute = require("./routes/register");

const app = express();

// ── CORS ──
const allowedOrigins = [
  "http://127.0.0.1:5500",  // VS Code Live Server
  "http://localhost:5500",
];
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// ── Body parser ──
app.use(express.json());

// ── Routes ──
app.use("/api/register", registerRoute);

app.get("/", (_req, res) => {
  res.json({ status: "ANARC Registration API is running" });
});

// ── Database + Start ──
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
