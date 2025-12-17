const express = require('express');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const app = express();

// ===========================================
// CONFIGURATION
// ===========================================
const CONFIG = {
    // Twilio credentials (ONE account for all clients)
    // Use environment variables for security (Render will set these)
    // For local testing, create a .env file (not committed to git)
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    
    // Base URL - automatically detects if running on Render or locally
    BASE_URL: process.env.RENDER_EXTERNAL_URL || process.env.BASE_URL || 'http://localhost:3000',
    
    // Client configurations - map phone numbers to business info
    // Add a new entry for each client
    CLIENTS: {
        // Brick Staining
        '+18663288123': {
            businessName: 'Preferred Brick Staining Solutions',
            businessPhone: '443-278-1451',
            formUrl: process.env.RENDER_EXTERNAL_URL || process.env.BASE_URL || 'http://localhost:3000',
            slug: 'brick-staining' // for routing to specific forms/admin
        }
        // Add more clients like this:
        // '+1YYYYYYYYYY': {
        //     businessName: 'Another Business',
        //     businessPhone: '555-123-4567',
        //     formUrl: 'https://another-business.com/form',
        //     slug: 'another-business'
        // }
    },
    
    PORT: process.env.PORT || 3000
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
    const toNumber = req.body.To; // This tells us which client
    const messageBody = req.body.Body || '';
    
    // Find which client this phone number belongs to
    const client = CONFIG.CLIENTS[toNumber];
    
    if (!client) {
        console.error(`Unknown Twilio number: ${toNumber}`);
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message('Sorry, this number is not configured.');
        res.type('text/xml');
        return res.send(twiml.toString());
    }
    
    console.log(`[${client.businessName}] SMS from ${fromNumber}: "${messageBody}"`);
    
    // Auto-reply with form link using client's info
    const replyMessage = `Thanks for reaching out to ${client.businessName}!

To get your free quote, fill out our quick form:
${client.formUrl}

We'll review your project and contact you within 24 hours.`;

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyMessage);

    res.type('text/xml');
    res.send(twiml.toString());
});

// Twilio voice webhook
app.post('/voice-webhook', (req, res) => {
    const fromNumber = req.body.From;
    const toNumber = req.body.To; // This tells us which client
    const callSid = req.body.CallSid;
    
    // Find which client this phone number belongs to
    const client = CONFIG.CLIENTS[toNumber];
    
    if (!client) {
        console.error(`Unknown Twilio number: ${toNumber}`);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, this number is not configured.');
        res.type('text/xml');
        return res.send(twiml.toString());
    }
    
    console.log(`[${client.businessName}] Call from ${fromNumber} (CallSid: ${callSid})`);
    
    const smsMessage = `Thanks for calling ${client.businessName}!

To get your free quote, fill out our quick form:
${client.formUrl}

We'll review your project and contact you within 24 hours.`;

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({
        voice: 'alice'
    }, `Thank you for calling ${client.businessName}. We just sent you a text message with a link to request your free quote. Please check your messages. We look forward to helping with your project.`);
    
    // Send SMS after the call
    if (CONFIG.TWILIO_ACCOUNT_SID !== 'YOUR_ACCOUNT_SID' && CONFIG.TWILIO_AUTH_TOKEN !== 'YOUR_AUTH_TOKEN') {
        const twilioClient = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);
        twilioClient.messages.create({
            body: smsMessage,
            to: fromNumber,
            from: toNumber // Use the same number that received the call
        }).then(msg => {
            console.log(`[${client.businessName}] SMS sent to ${fromNumber}: ${msg.sid}`);
        }).catch(err => {
            console.error(`[${client.businessName}] Error sending SMS:`, err);
        });
    }

    res.type('text/xml');
    res.send(twiml.toString());
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
