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
    const formHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Referer': 'https://taxii-three.vercel.app/'
    };

    const formPayload = {
      _subject: `${code} is your Empire Cab security code`,
      _captcha: 'false',
      _replyto: 'no-reply@empirecab.in',
      Security_Code: code,
      Account_Email: userEmail,
      Message: `Your Empire Cab 6-digit verification code is: ${code}. Valid for 5 minutes.`
    };

    // 1. Send directly to target user email
    try {
      const resp1 = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: formHeaders,
        body: JSON.stringify(formPayload)
      });
      const data1 = await resp1.json().catch(() => ({}));
      console.log('[OTP Serverless] FormSubmit target:', userEmail, data1);
    } catch (e1) {
      console.warn('[OTP Serverless] Target error:', e1);
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

    return res.status(200).json({
      success: true,
      via: 'dual_dispatched',
      code
    });

  } catch (error) {
    console.error('[OTP API Error]:', error);
    return res.status(200).json({ success: true, via: 'fallback_handled', code });
  }
}
