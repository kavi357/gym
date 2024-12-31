const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Define a storage mechanism for messages (you might want to use a database in a real-world scenario)
let messages = [];

router.post("/sendEmail", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "a81022768@gmail.com", //  Gmail email address
        pass: "mkaplzqbjhpkqjnm", //  App Password
      },
    });

    const info = await transporter.sendMail({
      from: "a81022768@gmail.com",
      to: to,
      subject: subject,
      text: body,
      html: `<b>${body}</b>`,
    });

    // Store the sent email in the messages array
    messages.push({
      from: "a81022768@gmail.com",
      to: to,
      subject: subject,
      text: body,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

// Route to display messages to a specific email address
router.get("/displayMessages/:email", (req, res) => {
  const { email } = req.params;

  // Filter messages for the specified email address
  const userMessages = messages.filter((message) => message.to === email);

  res.status(200).json(userMessages);
});

// Route to reply to an email
router.post("/replyToEmail", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "a81022768@gmail.com", //  Gmail email address
        pass: "mkaplzqbjhpkqjnm", //  your App Password
      },
    });

    const info = await transporter.sendMail({
      from: "a81022768@gmail.com",
      to: to,
      subject: subject,
      text: body,
      html: `<b>${body}</b>`,
    });

    // Store the sent email in the messages array
    messages.push({
      from: "a81022768@gmail.com",
      to: to,
      subject: subject,
      text: body,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send("Email replied successfully!");
  } catch (error) {
    console.error("Error replying to email:", error);
    res.status(500).send("Error replying to email");
  }
});

module.exports = router;
