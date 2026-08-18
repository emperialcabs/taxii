import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email, code } = req.method === 'POST' ? (req.body || {}) : (req.query || {});

  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email and code are required' });
  }

  const userEmail = String(email).toLowerCase().trim();

  // 1. Brevo Direct REST API & SMTP Engine
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  const brevoUser = process.env.BREVO_USER || process.env.VITE_BREVO_USER || 'b5efd3001@smtp-brevo.com';
  const brevoPass = process.env.BREVO_PASS || process.env.VITE_BREVO_PASS || brevoApiKey;

  if (brevoApiKey) {
    try {
      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'EMPERIAL CABS', email: 'emperialcabs@gmail.com' },
          to: [{ email: userEmail }],
          subject: `${code} is your EMPERIAL CABS verification code`,
          textContent: `Your EMPERIAL CABS verification code is: ${code}. Valid for 5 minutes.`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; background: #ffffff; margin: 0 auto;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">EMPERIAL CABS</h2>
              <p style="color: #475569; font-size: 15px;">Your 6-digit security verification code is:</p>
              <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #10b981; background: #f0fdf4; border: 1px solid #10b981; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">${code}</div>
              <p style="color: #94a3b8; font-size: 13px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
            </div>
          `
        })
      });
      if (resp.ok) {
        return res.status(200).json({ success: true, via: 'brevo_direct', userEmail });
      }
    } catch (e) {
      console.error('Brevo API Error:', e);
    }
  }

  if (brevoPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: brevoUser,
          pass: brevoPass
        }
      });

      await transporter.sendMail({
        from: '"EMPERIAL CABS" <emperialcabs@gmail.com>',
        to: userEmail,
        subject: `${code} is your EMPERIAL CABS verification code`,
        text: `Your EMPERIAL CABS 6-digit security OTP code is: ${code}. Valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; background: #ffffff; margin: 0 auto;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">EMPERIAL CABS</h2>
            <p style="color: #475569; font-size: 15px;">Your 6-digit security verification code is:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #10b981; background: #f0fdf4; border: 1px solid #10b981; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">${code}</div>
            <p style="color: #94a3b8; font-size: 13px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      });

      return res.status(200).json({ success: true, via: 'brevo_smtp', userEmail });
    } catch (e) {
      console.error('Brevo SMTP Error:', e);
    }
  }

  // 2. Resend Direct REST API (3,000 Free Emails / Month)
  const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'EMPERIAL CABS <onboarding@resend.dev>',
          to: [userEmail],
          subject: `${code} is your EMPERIAL CABS verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; background: #ffffff; margin: 0 auto;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">EMPERIAL CABS</h2>
              <p style="color: #475569; font-size: 15px;">Your 6-digit security verification code is:</p>
              <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #10b981; background: #f0fdf4; border: 1px solid #10b981; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">${code}</div>
              <p style="color: #94a3b8; font-size: 13px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
            </div>
          `
        })
      });
      if (resp.ok) {
        return res.status(200).json({ success: true, via: 'resend_direct', userEmail });
      }
    } catch (e) {
      console.error('Resend API Error:', e);
    }
  }

  // 3. Gmail SMTP Fallback
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD;
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || 'emperialcabs@gmail.com',
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: '"EMPERIAL CABS" <emperialcabs@gmail.com>',
        to: userEmail,
        subject: `${code} is your EMPERIAL CABS verification code`,
        text: `Your EMPERIAL CABS 6-digit security OTP code is: ${code}. Valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 480px; background: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0;">EMPERIAL CABS</h2>
            <p style="color: #475569; font-size: 15px;">Your 6-digit security verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">${code}</div>
            <p style="color: #94a3b8; font-size: 13px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      });

      return res.status(200).json({ success: true, via: 'smtp_direct', userEmail });
    } catch (e) {
      console.error('SMTP Error:', e);
    }
  }

  return res.status(200).json({ success: true, via: 'handled', userEmail });
}
