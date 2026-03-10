const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, trim: true, uppercase: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  eventName: { type: String, required: true, default: "SOAR Test 12.0" },
  registrationId: { type: String, unique: true, default: () => uuidv4() },
  createdAt: { type: Date, default: Date.now },
});

// Prevent the same student from registering twice for the same event
studentSchema.index({ rollNumber: 1, eventName: 1 }, { unique: true });
studentSchema.index({ email: 1, eventName: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
