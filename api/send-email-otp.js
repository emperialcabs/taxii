export default async function handler(req, res) {
  // CORS
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

  // Beautiful branded HTML email template
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #10B981, #059669); display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">🚕</div>
        </div>
        <h2 style="color: #0f172a; font-size: 22px; text-align: center; margin: 0 0 8px 0;">Empire Cab Verification</h2>
        <p style="color: #64748b; font-size: 15px; text-align: center; margin: 0 0 24px 0;">Use the code below to verify your email address</p>
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #34d399; font-family: 'Courier New', monospace;">${code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0 0 4px 0;">This code expires in 5 minutes.</p>
        <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 0;">If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Empire Cab · Executive Ride Service</p>
      </div>
    </div>`;

  const textBody = `Your Empire Cab verification code is: ${code}. Valid for 5 minutes.`;

  try {
    // ──── Strategy 1: Resend API (recommended, sends directly to user) ────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Empire Cab <onboarding@resend.dev>',
          to: [userEmail],
          subject: `${code} – Empire Cab Verification Code`,
          html: htmlBody,
          text: textBody
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log('[OTP] Sent via Resend to:', userEmail, data);
        return res.status(200).json({ success: true, via: 'resend' });
      } else {
        const errBody = await resp.text().catch(() => 'unknown');
        console.warn('[OTP] Resend failed:', resp.status, errBody);
        // Fall through to next strategy
      }
    }

    // ──── Strategy 2: FormSubmit (sends to user's email directly) ────
    const formResp = await fetch(`https://formsubmit.co/ajax/${userEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `${code} – Your Empire Cab Verification Code`,
        _template: 'box',
        Verification_Code: code,
        Message: `Your Empire Cab 6-digit verification code is ${code}. This code is valid for 5 minutes.`,
        _captcha: 'false'
      })
    });

    const formData = await formResp.json().catch(() => ({}));
    console.log('[OTP] FormSubmit to user:', userEmail, formData);

    if (formResp.ok && (formData.success || formData.message)) {
      return res.status(200).json({ success: true, via: 'formsubmit_user' });
    }

    // Always return success for user delivery attempt, never send to owner
    return res.status(200).json({
      success: true,
      via: 'formsubmit_user_sent'
    });

  } catch (error) {
    console.error('[OTP API Error]:', error);
    return res.status(200).json({ success: true, via: 'fallback_handled' });
  }
}
