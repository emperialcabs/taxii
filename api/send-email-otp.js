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

  const targetEmail = String(email).toLowerCase().trim();

  try {
    // Dispatch real email to user inbox via FormSubmit API (100% Free)
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://taxi-three.vercel.app/'
      },
      body: JSON.stringify({
        _subject: `${code} is your Empire Cab Verification Code`,
        Verification_Code: code,
        Message: `Your Empire Cab 6-digit verification code is ${code}. Valid for 5 minutes.`
      })
    });

    const data = await response.json();
    console.log('[Email OTP API Proxy] Real email sent to:', targetEmail, data);

    return res.status(200).json({ success: true, via: 'formsubmit', data });
  } catch (error) {
    console.error('[API Send Email OTP Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
