const { Router } = require("express");
const router = Router();
const nodemailer = require("nodemailer");

router.post("/send", (req, res, next) => {
  const { from_fullname, from_email, from_subject, from_body } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: from_email,
    to: process.env.GMAIL_USER,
    subject: `New mail from: ${from_fullname}`,
    html: `<h1>Subject: ${from_subject}</h1><h3>${from_fullname} - ${from_email}</h3><h2>Message: ${from_body}</h2>`,
  };

  transporter.sendMail(mailOptions, (e, r) => {
    if (e) {
      next(e);
    } else {
      res.json(r);
    }
  });
});

module.exports = router;
