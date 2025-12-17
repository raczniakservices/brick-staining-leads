const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// ===========================================
// CONFIGURATION
// ===========================================
const CONFIG = {
    // Twilio credentials (get from twilio.com/console)
    TWILIO_ACCOUNT_SID: 'YOUR_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: 'YOUR_AUTH_TOKEN',
    TWILIO_PHONE_NUMBER: '+1XXXXXXXXXX',
    
    // Your form URL (update after deploying)
    FORM_URL: 'http://localhost:3000',
    
    // Business info
    BUSINESS_NAME: 'Preferred Brick Staining Solutions',
    BUSINESS_PHONE: '443-278-1451',
    
    // Your phone for testing
    TEST_PHONE: '443-876-1983',
    
    PORT: 3000
};

// ===========================================
// MIDDLEWARE
// ===========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ===========================================
// DATABASE
// ===========================================
const DB_PATH = path.join(__dirname, 'leads.json');

function getLeads() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveLead(lead) {
    const leads = getLeads();
    lead.id = Date.now();
    lead.status = 'new';
    leads.push(lead);
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
    return lead;
}

// ===========================================
// ROUTES
// ===========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/submit-lead', (req, res) => {
    try {
        const lead = saveLead(req.body);
        console.log(`New lead: ${lead.firstName} ${lead.lastName} - ${lead.phone}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ success: false });
    }
});

app.get('/api/leads', (req, res) => {
    res.json(getLeads());
});

// Twilio SMS webhook
app.post('/sms-webhook', (req, res) => {
    const fromNumber = req.body.From;
    console.log(`SMS from ${fromNumber}`);
    
    const message = `Thanks for reaching out to ${CONFIG.BUSINESS_NAME}!

To get your free quote, fill out our quick form:
${CONFIG.FORM_URL}

We'll review your project and contact you within 24 hours.`;

    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`);
});

// Twilio voice webhook
app.post('/voice-webhook', (req, res) => {
    const fromNumber = req.body.From;
    console.log(`Call from ${fromNumber}`);
    
    const smsMessage = `Thanks for calling ${CONFIG.BUSINESS_NAME}!

To get your free quote, fill out our quick form:
${CONFIG.FORM_URL}

We'll review your project and contact you within 24 hours.`;

    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Thank you for calling Preferred Brick Staining Solutions. We just sent you a text message with a link to request your free quote. Please check your messages. We look forward to helping with your project.</Say>
    <Sms>${smsMessage}</Sms>
</Response>`);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ===========================================
// START
// ===========================================
app.listen(CONFIG.PORT, () => {
    console.log(`
Server Running
==============
Form: http://localhost:${CONFIG.PORT}
Admin: http://localhost:${CONFIG.PORT}/admin

Twilio Webhooks:
  SMS: YOUR_PUBLIC_URL/sms-webhook
  Voice: YOUR_PUBLIC_URL/voice-webhook
==============
    `);
});
