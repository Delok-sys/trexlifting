import express from "express";
import nodemailer from "nodemailer";

const PORT = 3001;
const CONTACT_TARGET_EMAIL = "sebastian@trexlifting.de";
const app = express();

app.use(express.json({ limit: "1mb" }));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function buildMailBody({ name, email, notes, includeDashboardData, dashboardData }) {
  const dashboardBlock = includeDashboardData
    ? `\n\nDashboard-Daten (Redux):\n${JSON.stringify(dashboardData, null, 2)}`
    : "\n\nDashboard-Daten wurden nicht angehaengt.";

  return [
    "Neue Kontaktanfrage ueber trexlifting.de",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    "",
    "Notizen:",
    notes,
    dashboardBlock,
  ].join("\n");
}

app.post("/api/contact", async (request, response) => {
  const { name, email, notes, includeDashboardData = false, dashboardData = null } = request.body ?? {};

  if (!name?.trim() || !email?.trim() || !notes?.trim()) {
    response.status(400).json({
      message: "Name, E-Mail und Notizen sind Pflichtfelder.",
    });
    return;
  }

  const transporter = createTransporter();

  if (!transporter) {
    response.status(500).json({
      message: "Mailversand ist nicht konfiguriert. Bitte SMTP-Umgebungsvariablen setzen.",
    });
    return;
  }

  const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const mailText = buildMailBody({
    name: name.trim(),
    email: email.trim(),
    notes: notes.trim(),
    includeDashboardData,
    dashboardData,
  });

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: CONTACT_TARGET_EMAIL,
      replyTo: email.trim(),
      subject: `Kontaktanfrage von ${name.trim()}`,
      text: mailText,
    });

    response.status(200).json({ message: "Nachricht erfolgreich gesendet." });
  } catch (error) {
    response.status(500).json({
      message: "Nachricht konnte nicht gesendet werden.",
      error: error.message,
    });
  }
});

app.use((request, response) => {
  response.status(404).json({ message: "Route nicht gefunden." });
});

app.listen(PORT, () => {
  console.log(`Demo backend running on http://localhost:${PORT}`);
});
