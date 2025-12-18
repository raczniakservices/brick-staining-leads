# Lead Capture System

Automated lead capture with SMS/call auto-reply.

## Quick Start

```bash
cd lead-capture-system
npm install
npm start
```

Then open: http://localhost:3000

## URLs

- **Form**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API**: http://localhost:3000/api/leads

## Twilio Setup (for SMS/Call auto-reply)

1. Create account at twilio.com
2. Get a phone number (~$1/month)
3. Edit `server.js` and fill in:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

4. Use ngrok to expose locally: `ngrok http 3000`
5. In Twilio console, set webhooks:
   - SMS webhook: `https://YOUR_NGROK_URL/sms-webhook`
   - Voice webhook: `https://YOUR_NGROK_URL/voice-webhook`

## To Deploy (make public)

Options:
- **Render.com** (free tier)
- **Railway.app** (free tier)
- **Vercel** (free)

After deploying, update `FORM_URL` in server.js with your public URL.

## Email Notifications (optional)

This app can send an email to the business owner when a new lead is submitted.

### Environment Variables

Set these in your host (Render) to enable:

- `EMAIL_ENABLED=1`
- `EMAIL_TO=owner@yourbusiness.com`
- `EMAIL_FROM=leads@yourdomain.com` (or any verified sender your SMTP provider allows)
- `EMAIL_SMTP_HOST=smtp.yourprovider.com`
- `EMAIL_SMTP_PORT=587`
- `EMAIL_SMTP_SECURE=0` (use 1 for port 465)
- `EMAIL_SMTP_USER=...`
- `EMAIL_SMTP_PASS=...`

Optional:
- `EMAIL_SEND_CUSTOMER_CONFIRMATION=1` (send a basic confirmation email to the customer if they provided an email)

