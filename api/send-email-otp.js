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

  try {
    // ──── FormSubmit Delivery with mandatory Referer & User-Agent headers ────
    const formHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://taxii-three.vercel.app/'
    };

    const formPayload = {
      _subject: `Empire Cab Code: ${code}`,
      Verification_Code: code,
      Customer_Email: userEmail,
      Message: `Your Empire Cab 6-digit verification code is: ${code}. This code is valid for 5 minutes.`,
      _captcha: 'false'
    };

    // 1. Send directly to user's target email address
    try {
      const resp1 = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: formHeaders,
        body: JSON.stringify(formPayload)
      });
      const data1 = await resp1.json().catch(() => ({}));
      console.log('[OTP] FormSubmit target user:', userEmail, data1);
    } catch (e1) {
      console.warn('[OTP] FormSubmit target error:', e1);
    }

    // 2. Send copy to emperialcabs@gmail.com if different
    if (userEmail !== 'emperialcabs@gmail.com') {
      try {
        await fetch('https://formsubmit.co/ajax/emperialcabs@gmail.com', {
          method: 'POST',
          headers: formHeaders,
          body: JSON.stringify({
            ...formPayload,
            _subject: `Empire Cab Code for ${userEmail}: ${code}`
          })
        });
      } catch (e2) {}
    }

    // 3. Resend API (if configured in environment)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Empire Cab <onboarding@resend.dev>',
            to: [userEmail],
            subject: `${code} – Empire Cab Verification Code`,
            html: `<div style="font-family:Arial,sans-serif;padding:32px;text-align:center"><h2>Empire Cab Verification</h2><p>Your verification code is:</p><div style="background:#0f172a;border-radius:12px;padding:20px;margin:16px auto;max-width:240px"><span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#10b981;font-family:monospace">${code}</span></div><p style="color:#64748b;font-size:13px">Valid for 5 minutes.</p></div>`,
            text: `Your Empire Cab verification code is: ${code}. Valid for 5 minutes.`
          })
        });
      } catch (rErr) {}
    }

    return res.status(200).json({
      success: true,
      via: 'formsubmit_dispatched',
      code
    });

  } catch (error) {
    console.error('[OTP API Error]:', error);
    return res.status(200).json({ success: true, via: 'fallback_handled', code });
  }
}
