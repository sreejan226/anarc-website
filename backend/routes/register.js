const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { generateAdmitCard } = require("../services/pdfService");
const { sendAdmitCard } = require("../services/emailService");

// POST /api/register
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, rollNumber, department, year, eventName } = req.body;

    // ── Validate required fields ──
    if (!name || !email || !phone || !rollNumber || !department || !year) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address." });
    }

    // ── Check for duplicates ──
    const existing = await Student.findOne({
      $or: [
        { email: email.toLowerCase(), eventName },
        { rollNumber: rollNumber.toUpperCase(), eventName },
      ],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "You have already registered for this event. Check your email for the admit card.",
      });
    }

    // ── Save to database ──
    const student = await Student.create({
      name,
      email,
      phone,
      rollNumber,
      department,
      year,
      eventName: eventName || "SOAR Test 12.0",
    });

    // ── Generate admit card PDF ──
    const pdfBuffer = await generateAdmitCard(student);

    // ── Email admit card ──
    await sendAdmitCard(student.email, student.name, pdfBuffer);

    return res.status(201).json({
      success: true,
      registrationId: student.registrationId,
      message: "Registration successful. Admit card sent to your email.",
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle Mongoose duplicate key error (safety net if race condition)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event.",
      });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error. Please try again." });
  }
});

module.exports = router;
