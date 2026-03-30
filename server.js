const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "https://bleadonoak.co.uk",
    "https://www.bleadonoak.co.uk"
  ]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend működik");
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.post("/contact", async (req, res) => {
  const { nev, email, telefon, uzenet } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      replyTo: email,
      to: process.env.EMAIL,
      subject: "New client",
      text: `Name: ${nev}
Email: ${email}
Phone: ${telefon}

Message:
${uzenet}`,
    });

    res.json({ success: true, message: "Az üzenet sikeresen elküldve." });
  } catch (error) {
    console.error("Email küldési hiba:", error);
    res.status(500).json({
      success: false,
      message: "Hiba történt az email küldése közben.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server fut a ${PORT} porton`);
});