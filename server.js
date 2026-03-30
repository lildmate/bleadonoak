const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend működik");
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
      text: `
Name: ${nev}
Email: ${email}
Phone: ${telefon}

Message:
${uzenet}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email küldési hiba:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server fut a ${PORT} porton`);
});