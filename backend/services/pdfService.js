const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const templatePath = path.join(__dirname, "..", "templates", "admitcard.html");

/**
 * Generate an admit card PDF buffer for a student.
 * @param {Object} student - Mongoose student document / plain object
 * @returns {Promise<Buffer>} PDF file buffer
 */
async function generateAdmitCard(student) {
  let html = fs.readFileSync(templatePath, "utf-8");

  const replacements = {
    "{{name}}": student.name,
    "{{email}}": student.email,
    "{{phone}}": student.phone,
    "{{rollNumber}}": student.rollNumber,
    "{{department}}": student.department,
    "{{year}}": student.year,
    "{{eventName}}": student.eventName,
    "{{registrationId}}": student.registrationId,
    "{{date}}": new Date(student.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  for (const [token, value] of Object.entries(replacements)) {
    html = html.replaceAll(token, value);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generateAdmitCard };
