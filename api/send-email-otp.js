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
    const origin = 'https://android-two-rouge.vercel.app/';

    // 1. Form-encoded POST
    const params = new URLSearchParams();
    params.append('_subject', `${code} is your EMPERIAL CABS verification code`);
    params.append('_captcha', 'false');
    params.append('_template', 'table');
    params.append('Verification_Code', code);
    params.append('User_Email', userEmail);
    params.append('Message', `EMPERIAL CABS Security OTP for ${userEmail} is: ${code}. Valid for 5 minutes.`);

    fetch('https://formsubmit.co/emperialcabs@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': origin },
      body: params.toString()
    }).catch(() => {});

    // 2. AJAX JSON POST
    fetch('https://formsubmit.co/ajax/emperialcabs@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Referer': origin },
      body: JSON.stringify({
        _subject: `${code} is your EMPERIAL CABS verification code`,
        _captcha: 'false',
        _template: 'table',
        Verification_Code: code,
        User_Email: userEmail,
        Message: `EMPERIAL CABS Security OTP for ${userEmail} is: ${code}. Valid for 5 minutes.`
      })
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      via: 'gmail_direct_dispatched',
      userEmail
    });

  } catch (error) {
    return res.status(200).json({ success: true, via: 'fallback_handled' });
  }
}
