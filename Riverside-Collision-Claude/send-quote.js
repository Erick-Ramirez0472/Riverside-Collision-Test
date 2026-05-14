// api/send-quote.js
// Vercel Serverless Function — also compatible with Netlify Functions (rename to netlify/functions/send-quote.js)
// Requires environment variable: RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    firstName, lastName, email, phone,
    year, make, model, color,
    damageType, insurance, description,
  } = req.body;

  // Basic server-side validation
  if (!firstName || !lastName || !email || !phone || !year || !make || !model || !damageType || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Map damage type code to readable label
  const damageLabels = {
    collision: 'Collision / Accident Damage',
    dent: 'Dents / Dings',
    hail: 'Hail Damage',
    scratch: 'Scratches / Paint Damage',
    frame: 'Frame / Structural Damage',
    bumper: 'Bumper Repair / Replacement',
    other: 'Other',
  };
  const damageLabel = damageLabels[damageType] || damageType;

  // ── Email to SHOP (notification) ──────────────────────────────────────────
  const shopEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: 'Barlow', Arial, sans-serif; background: #0a0a0a; color: #e8e8e8; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 2rem; }
  .header { background: #111; border-top: 3px solid #d42b2b; padding: 1.5rem 2rem; margin-bottom: 1.5rem; }
  .header h1 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }
  .header h1 span { color: #3ad4f5; }
  .badge { display: inline-block; background: rgba(58,212,245,0.1); border: 1px solid rgba(58,212,245,0.3); color: #3ad4f5; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.25rem 0.75rem; margin-bottom: 1rem; }
  .section { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.06); padding: 1.5rem; margin-bottom: 1rem; }
  .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; }
  .row { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
  .label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.1em; width: 130px; flex-shrink: 0; padding-top: 2px; }
  .value { color: #e8e8e8; font-size: 0.9rem; }
  .value.highlight { color: #3ad4f5; font-weight: 600; }
  .description-box { background: #222; border-left: 2px solid #d42b2b; padding: 1rem; margin-top: 0.5rem; color: #e8e8e8; font-size: 0.9rem; line-height: 1.6; }
  .footer { text-align: center; padding: 1.5rem; color: #555; font-size: 0.75rem; }
  .reply-btn { display: inline-block; background: #d42b2b; color: #fff; text-decoration: none; padding: 0.75rem 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; margin-top: 1rem; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Riverside <span>Collision Repair</span></h1>
    <p style="color:#888; font-size:0.85rem; margin:0.25rem 0 0;">New Quote Request Received</p>
  </div>

  <div class="badge">New Quote Request</div>

  <div class="section">
    <div class="section-title">Customer Information</div>
    <div class="row"><span class="label">Name</span><span class="value highlight">${firstName} ${lastName}</span></div>
    <div class="row"><span class="label">Email</span><span class="value"><a href="mailto:${email}" style="color:#3ad4f5;">${email}</a></span></div>
    <div class="row"><span class="label">Phone</span><span class="value"><a href="tel:${phone}" style="color:#3ad4f5;">${phone}</a></span></div>
  </div>

  <div class="section">
    <div class="section-title">Vehicle Information</div>
    <div class="row"><span class="label">Vehicle</span><span class="value highlight">${year} ${make} ${model}${color ? ` — ${color}` : ''}</span></div>
    <div class="row"><span class="label">Damage Type</span><span class="value">${damageLabel}</span></div>
    ${insurance ? `<div class="row"><span class="label">Insurance</span><span class="value">${insurance}</span></div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Damage Description</div>
    <div class="description-box">${description.replace(/\n/g, '<br/>')}</div>
  </div>

  <div style="text-align:center; padding: 1rem 0;">
    <a href="mailto:${email}?subject=Re: Your Quote Request — ${year} ${make} ${model}" class="reply-btn">Reply to Customer</a>
  </div>

  <div class="footer">
    <p>Riverside Collision Repair &mdash; Excellence, That's Our Goal</p>
    <p>This email was generated automatically from your website quote form.</p>
  </div>
</div>
</body>
</html>
  `.trim();

  // ── Confirmation email to CUSTOMER ────────────────────────────────────────
  const customerEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #e8e8e8; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 2rem; }
  .header { background: #111; border-top: 3px solid #3ad4f5; padding: 2rem; margin-bottom: 1.5rem; text-align: center; }
  .header h1 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.5rem; }
  .header h1 span { color: #3ad4f5; }
  .header p { color: #888; font-size: 0.9rem; margin: 0; }
  .message { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.06); padding: 2rem; margin-bottom: 1rem; }
  .message p { color: #ccc; line-height: 1.7; margin: 0 0 1rem; }
  .summary { background: #222; border-left: 3px solid #d42b2b; padding: 1rem 1.5rem; margin: 1.5rem 0; }
  .summary p { margin: 0.25rem 0; font-size: 0.875rem; color: #ccc; }
  .summary strong { color: #e8e8e8; }
  .cta { display: inline-block; background: #d42b2b; color: #fff; text-decoration: none; padding: 0.75rem 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; margin-top: 0.5rem; }
  .footer { text-align: center; padding: 1.5rem; color: #555; font-size: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 1.5rem; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Riverside <span>Collision Repair</span></h1>
    <p>Excellence — That's Our Goal</p>
  </div>

  <div class="message">
    <p>Hi ${firstName},</p>
    <p>Thanks for reaching out! We've received your quote request and will review the details and get back to you <strong>within one business day</strong>.</p>

    <div class="summary">
      <p><strong>Vehicle:</strong> ${year} ${make} ${model}${color ? ` (${color})` : ''}</p>
      <p><strong>Damage Type:</strong> ${damageLabel}</p>
      ${insurance ? `<p><strong>Insurance:</strong> ${insurance}</p>` : ''}
    </div>

    <p>If you need to reach us sooner, feel free to call us or reply to this email.</p>
    <a href="tel:+18015550000" class="cta">Call Us Now</a>
  </div>

  <div class="footer">
    <p><strong style="color:#e8e8e8;">Riverside Collision Repair</strong></p>
    <p>Utah County, UT &bull; info@riversidecollision.com &bull; (801) 555-0000</p>
    <p style="margin-top:0.75rem;">You received this because you submitted a quote request on our website.</p>
  </div>
</div>
</body>
</html>
  `.trim();

  // ── Send via Resend ────────────────────────────────────────────────────────
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Destination email — set via env var or hardcode your shop email
  const SHOP_EMAIL = process.env.SHOP_EMAIL || 'info@riversidecollision.com';
  // From address — must be a verified Resend domain
  const FROM_EMAIL = process.env.FROM_EMAIL || 'quotes@riversidecollision.com';

  try {
    // Send both emails in parallel
    const [shopRes, customerRes] = await Promise.all([
      // 1. Notify the shop
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Riverside Quote Form <${FROM_EMAIL}>`,
          to: [SHOP_EMAIL],
          reply_to: email,
          subject: `🔧 New Quote: ${year} ${make} ${model} — ${firstName} ${lastName}`,
          html: shopEmailHtml,
        }),
      }),
      // 2. Confirm to the customer
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Riverside Collision Repair <${FROM_EMAIL}>`,
          to: [email],
          subject: `We received your quote request — Riverside Collision Repair`,
          html: customerEmailHtml,
        }),
      }),
    ]);

    if (!shopRes.ok || !customerRes.ok) {
      const shopErr = await shopRes.json().catch(() => ({}));
      const custErr = await customerRes.json().catch(() => ({}));
      console.error('Resend errors:', { shopErr, custErr });
      return res.status(502).json({ message: 'Email delivery failed. Please try again.' });
    }

    return res.status(200).json({ message: 'Quote request sent successfully' });
  } catch (err) {
    console.error('Resend fetch error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
