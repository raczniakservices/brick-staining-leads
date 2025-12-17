const express = require('express');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const app = express();

// Cloudinary configuration
// Try CLOUDINARY_URL first (recommended), then individual credentials
let cloudinaryConfigured = false;

if (process.env.CLOUDINARY_URL) {
    // Parse CLOUDINARY_URL and configure explicitly
    const url = process.env.CLOUDINARY_URL.trim(); // Remove any whitespace
    const match = url.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    if (match) {
        const apiKey = match[1].trim();
        const apiSecret = match[2].trim();
        const cloudName = match[3].trim();
        
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });
        console.log('Cloudinary configured from CLOUDINARY_URL');
        console.log('  cloud_name:', cloudName);
        console.log('  api_key:', apiKey.substring(0, 5) + '...');
        console.log('  api_secret length:', apiSecret.length);
        cloudinaryConfigured = true;
    } else {
        console.error('Invalid CLOUDINARY_URL format. Expected: cloudinary://API_KEY:API_SECRET@CLOUD_NAME');
        console.error('Got:', url.substring(0, 30) + '...');
    }
}

if (!cloudinaryConfigured && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Cloudinary configured with individual credentials, cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
    cloudinaryConfigured = true;
}

if (!cloudinaryConfigured) {
    console.warn('Cloudinary not configured - photo uploads will be disabled');
}

// Multer for file uploads (memory storage)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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

// Test endpoint to verify Cloudinary credentials
app.get('/api/test-cloudinary', (req, res) => {
    const config = cloudinary.config();
    res.json({
        configured: !!config.cloud_name,
        cloud_name: config.cloud_name || 'NOT SET',
        api_key: config.api_key ? config.api_key.substring(0, 5) + '...' : 'NOT SET',
        has_api_secret: !!config.api_secret,
        api_secret_length: config.api_secret ? config.api_secret.length : 0,
        env_url: process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET',
        env_cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET'
    });
});

// Photo upload endpoint - accept both 'photos' and 'photo' field names
app.post('/api/upload-photos', upload.fields([{ name: 'photos', maxCount: 5 }, { name: 'photo', maxCount: 5 }]), async (req, res) => {
    try {
        // Handle both 'photos' and 'photo' field names
        const files = req.files?.photos || req.files?.photo || [];
        console.log('Photo upload request received, files:', files.length);
        
        if (!files || files.length === 0) {
            console.log('No files in request');
            return res.json({ success: true, photos: [] });
        }

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
            console.warn('Cloudinary not configured - photos will not be uploaded');
            return res.json({ success: true, photos: [] });
        }
        
        console.log('Uploading', files.length, 'photo(s) to Cloudinary...');

        const photoUrls = [];
        for (const file of files) {
            try {
                // Try upload_stream with minimal options
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'brick-staining-leads'
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    uploadStream.end(file.buffer);
                });
                
                photoUrls.push(result.secure_url);
                console.log('Photo uploaded successfully:', result.secure_url);
            } catch (error) {
                console.error('Photo upload failed:', file.originalname);
                console.error('Error:', error.message);
                // Check if it's a signature error
                if (error.http_code === 401) {
                    console.error('SIGNATURE ERROR - API secret may be incorrect');
                    console.error('Please verify API secret in Cloudinary console matches CLOUDINARY_URL');
                }
                // Continue - don't block form submission
            }
        }
        
        // Return success even if photos failed (form already submitted)
        if (photoUrls.length === 0 && files.length > 0) {
            console.warn('Photo uploads failed, but form submission succeeded');
        }

        console.log('All photos uploaded. Total:', photoUrls.length);
        res.json({ success: true, photos: photoUrls });
    } catch (error) {
        console.error('Error uploading photos:', error);
        console.error('Error details:', error.message, error.stack);
        res.status(500).json({ success: false, error: 'Failed to upload photos', details: error.message });
    }
});

app.post('/api/submit-lead', (req, res) => {
    try {
        const lead = saveLead(req.body);
        console.log(`New lead: ${lead.name || `${lead.firstName} ${lead.lastName}`} - ${lead.phone}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ success: false });
    }
});

// Simple admin authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'brick2024';

function checkAuth(req, res, next) {
    const password = req.headers['x-admin-password'] || req.query.password;
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

app.get('/api/leads', checkAuth, (req, res) => {
    res.json(getLeads());
});

// Update lead status
app.put('/api/leads/:id/status', checkAuth, (req, res) => {
    try {
        const leads = getLeads();
        const lead = leads.find(l => l.id == req.params.id);
        
        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }
        
        lead.status = req.body.status;
        fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
        res.json({ success: true, lead });
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ success: false, error: 'Failed to update status' });
    }
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

app.get('/estimate', (req, res) => {
    res.sendFile(path.join(__dirname, 'estimate-calculator.html'));
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
