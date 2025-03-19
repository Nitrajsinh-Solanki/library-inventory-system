// library-inventory-system\src\lib\email\gmail.ts


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOTP(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: '📚 Verify Your BookNest Account',
    html: `
      <div style="
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background: linear-gradient(to bottom right, #fdfcfb, #e2d1c3);
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      ">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="
            color: #8B5E3B;
            font-size: 28px;
            margin: 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #d4a373;
          ">
            Welcome to BookNest 📖
          </h1>
          <p style="color: #6B7280; font-size: 16px;">Your personal digital library experience</p>
        </div>

        <div style="text-align: center; padding: 24px 0;">
          <p style="
            font-size: 16px;
            color: #374151;
            margin-bottom: 16px;
          ">
            Here is your one-time verification code:
          </p>
          
          <div style="
            background: #8B5E3B;
            color: white;
            font-size: 36px;
            font-weight: bold;
            padding: 16px 32px;
            border-radius: 8px;
            letter-spacing: 4px;
            margin: 24px 0;
            display: inline-block;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          ">
            ${otp}
          </div>

          <p style="
            font-size: 14px;
            color: #6B7280;
            margin-top: 20px;
          ">
            This code will expire in <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
        </div>

        <div style="
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #d4a373;
          color: #6B7280;
          font-size: 12px;
        ">
          <p>📚 BookNest | Your gateway to knowledge</p>
          <p>© ${new Date().getFullYear()} BookNest. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}
