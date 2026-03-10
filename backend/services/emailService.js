const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
  },
});

/**
 * Send the admit card PDF to a student via email.
 * @param {string} email - Recipient email address
 * @param {string} name - Student name (used in greeting)
 * @param {Buffer} pdfBuffer - The generated PDF admit card
 */
async function sendAdmitCard(email, name, pdfBuffer) {
  await transporter.sendMail({
    from: `"ANARC — NIT Agartala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Admit Card — SOAR Test 12.0",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #263ea6;">Hello ${name},</h2>
        <p>Thank you for registering for <strong>SOAR Test 12.0</strong>!</p>
        <p>Your admit card is attached to this email as a PDF. Please print it and bring it to the venue along with a valid college ID.</p>
        <p>For any queries, contact us at <strong>anarc@nita.ac.in</strong>.</p>
        <br>
        <p>Best regards,<br><strong>Team ANARC</strong><br>NIT Agartala</p>
      </div>
    `,
    attachments: [
      {
        filename: "AdmitCard_SOAR12.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

module.exports = { sendAdmitCard };
