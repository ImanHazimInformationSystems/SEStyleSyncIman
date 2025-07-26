const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,       // your Gmail
      pass: process.env.EMAIL_PASS        // app password (not your real password)
    }
  });

  await transporter.sendMail({
    from: '"StyleSync" <noreply@stylesync.com>',
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
