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

  const { phone, code } = req.method === 'POST' ? (req.body || {}) : (req.query || {});
  const apiKey = (
    process.env.FAST2SMS_API_KEY ||
    process.env.VITE_FAST2SMS_API_KEY ||
    '5S9P6LKf8qzDT0tRkhu7HbGUcBX2rVOFjpAnodmEegCaNI3MwZckRFTr8SAhdOMwEt1CPlaugnUqZmX4'
  ).trim();

  if (!phone || !code) {
    return res.status(400).json({ success: false, error: 'Phone and code parameters are required' });
  }

  const cleanDigits = String(phone).replace(/\D/g, '').slice(-10);

  try {
    // 1. Fast2SMS Quick SMS Route (Active & Verified)
    const messageText = encodeURIComponent(`Your Empire Cab verification code is ${code}`);
    const quickUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${messageText}&language=english&flash=0&numbers=${cleanDigits}`;
    const qResponse = await fetch(quickUrl);
    const qData = await qResponse.json();

    if (qData && qData.return) {
      console.log('[Fast2SMS API Proxy] Real SMS sent to:', cleanDigits);
      return res.status(200).json({ success: true, via: 'fast2sms_q', data: qData });
    }

    // 2. Fast2SMS OTP Route Fallback
    const fastUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${code}&flash=0&numbers=${cleanDigits}`;
    const response = await fetch(fastUrl);
    const data = await response.json();

    if (data && data.return) {
      return res.status(200).json({ success: true, via: 'fast2sms_otp', data });
    }

    console.warn('[Fast2SMS API Response]:', qData || data);
    return res.status(200).json({
      success: false,
      error: qData?.message || data?.message || 'SMS delivery failed',
      code: qData?.status_code || data?.status_code
    });
  } catch (error) {
    console.error('[API Send OTP Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
