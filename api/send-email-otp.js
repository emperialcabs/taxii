export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { email, code } = req.method === 'POST' ? (req.body || {}) : (req.query || {});

  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email and code parameters are required' });
  }

  const userEmail = String(email).toLowerCase().trim();
  const ownerEmail = 'emperialcabs@gmail.com';

  try {
    // 1. Try Resend API if configured
    const resendKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    if (resendKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Empire Cabs <onboarding@resend.dev>',
          to: [userEmail],
          subject: `${code} is your Empire Cab Verification Code`,
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #0f172a;">Empire Cabs Verification</h2>
              <p style="font-size: 16px; color: #475569;">Your 6-digit email verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #fbbf24; background-color: #0f172a; padding: 15px; text-align: center; border-radius: 6px;">${code}</div>
              <p style="font-size: 14px; color: #94a3b8;">This code is valid for 5 minutes.</p>
            </div>
          </div>`
        })
      });
      if (response.ok) {
        return res.status(200).json({ success: true, via: 'resend' });
      }
    }

    // 2. Dispatch via Activated FormSubmit owner route so customers NEVER get activation emails
    const response = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://taxi-three.vercel.app/'
      },
      body: JSON.stringify({
        _subject: `${code} is your Empire Cab Verification Code`,
        User_Email: userEmail,
        Verification_Code: code,
        Message: `Your Empire Cab 6-digit verification code is ${code}. Valid for 5 minutes.`,
        _replyto: userEmail
      })
    });

    const data = await response.json();
    console.log('[Email OTP API Proxy] Sent via owner to:', userEmail, data);

    return res.status(200).json({ success: true, via: 'formsubmit_owner', data });
  } catch (error) {
    console.error('[API Send Email OTP Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
