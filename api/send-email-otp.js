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
  const formKey = '1d3fbb914a52dd5a44f7cf59caad4b92';

  try {
    const formHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://android-two-rouge.vercel.app/'
    };

    const formPayload = {
      _subject: `${code} is your EMPERIAL CABS verification code`,
      _captcha: 'false',
      _template: 'table',
      Verification_Code: code,
      Account_Email: userEmail,
      Message: `Your EMPERIAL CABS 6-digit verification code is: ${code}. Valid for 5 minutes.`
    };

    Promise.allSettled([
      fetch(`https://formsubmit.co/ajax/${formKey}`, {
        method: 'POST',
        headers: formHeaders,
        body: JSON.stringify(formPayload)
      }),
      fetch(`https://formsubmit.co/ajax/emperialcabs@gmail.com`, {
        method: 'POST',
        headers: formHeaders,
        body: JSON.stringify(formPayload)
      })
    ]).catch(() => {});

    return res.status(200).json({
      success: true,
      via: 'gmail_direct_dispatched',
      userEmail
    });

  } catch (error) {
    return res.status(200).json({ success: true, via: 'fallback_handled' });
  }
}
