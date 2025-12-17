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

