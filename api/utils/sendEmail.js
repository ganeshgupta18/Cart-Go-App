const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const sgMail = require('@sendgrid/mail');

const sendEmail = async ({ email, subject, message }) => {
  try {
    // 1. Resend Integration
    if (process.env.RESEND_API_KEY) {
      console.log('Sending email via Resend API...');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      
      const response = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: subject,
        html: message,
      });

      if (response.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }

      console.log(`Email successfully sent via Resend to ${email}`);
      return;
    }

    // 2. SendGrid Integration
    if (process.env.SENDGRID_API_KEY) {
      console.log('Sending email via SendGrid API...');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const fromEmail = process.env.EMAIL_FROM || 'itsganesh1801@gmail.com'; // Must be verified in SendGrid
      
      const msg = {
        to: email,
        from: fromEmail,
        subject: subject,
        html: message,
      };

      await sgMail.send(msg);
      console.log(`Email successfully sent via SendGrid to ${email}`);
      return;
    }

    // 3. Fallback: Gmail Nodemailer SMTP
    console.log('Sending email via Gmail SMTP fallback...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password mapping
      },
    });

    const mailOptions = {
      from: `"CartGo Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = sendEmail;

