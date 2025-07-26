const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or Mailtrap for dev
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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
