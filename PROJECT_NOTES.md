# Preferred Brick Staining Solutions - Lead Capture System

## Project Overview
Automated lead capture system for a brick staining company in Maryland. Owner currently handles everything via text/word-of-mouth. This system captures leads through a web form, stores them, and will eventually integrate with SMS automation.

## Live URLs
- **Form:** https://brick-staining-leads.onrender.com
- **Admin Dashboard:** https://brick-staining-leads.onrender.com/admin

## Client Details
- **Business:** Preferred Brick Staining Solutions
- **Website:** https://brickstainingsolutions.com/
- **Phone:** 443-278-1451
- **Location:** Edgewood, MD (serves Maryland area)
- **Email:** solutions@preferredbrick.com
- **Current Process:** All word-of-mouth, owner handles via text
- **Invoicing:** Uses something called "___mates" that charges 3%, connects to QuickBooks, no direct deposit set up

## Test Phone Number
- 443-876-1983 (your number for testing)

## Services Offered (from her website)
1. Brick Staining & Color Enhancement
2. Block Staining & Architectural Correction
3. Mortar Staining & Joint Blending
4. Stone Staining
5. Historic Restoration
6. Paver Staining / Sealing
7. Precast Staining
8. Graffiti Removal / Restoration

## Form Fields (Optimized)
| Field | Required | Purpose |
|-------|----------|---------|
| Name | Yes | Combined first/last |
| Phone | Yes | Primary contact |
| Email | No | Backup contact |
| Property Address | Yes | Job location |
| Property Type | Yes | Residential/Commercial |
| Best Way to Reach You | Yes | Text/Call/Email preference |
| Service Needed | Yes | What they want |
| Project Details | No | Description |
| Photos | No | Visual reference |
| How Did You Hear About Us? | Yes | Track referrals |

## Referral Sources (for tracking word-of-mouth)
- Friend/Family Referral
- Saw Our Work in the Neighborhood
- Google Search
- Facebook
- Previous Customer
- Other

## Tech Stack
- **Frontend:** HTML/CSS/JS (Montserrat font, burnt orange #C45C26 branding)
- **Backend:** Node.js + Express
- **Database:** JSON file (leads.json) - simple for now
- **Hosting:** Render.com (free tier)
- **Repo:** https://github.com/raczniakservices/brick-staining-leads

## Future Enhancements
1. **Twilio SMS Integration** - Auto-reply when people text/call (~$1/month + pennies per text)
2. **Photo Storage** - Currently photos show preview but don't persist. Need cloud storage (Cloudinary free tier or similar)
3. **Email Notifications** - Notify owner when new lead comes in
4. **Estimate Calculator** - Auto-generate rough estimates based on service + sqft
5. **Custom Domain** - Something like quote.brickstainingsolutions.com

## Known Limitations
- Photos currently only preview, not saved (need cloud storage)
- No SMS automation yet (needs Twilio)
- Free Render tier spins down after inactivity (50+ second delay on first visit)
- Leads stored in JSON file (will reset if server redeploys)

## Deployment
Push to GitHub and Render auto-deploys:
```
cd "C:\Users\User1\Desktop\Company Lead Finder\lead-capture-system"
git add .
git commit -m "your message"
git push
```

## Session History
- Created lead capture form with Preferred Brick Staining branding
- Deployed to Render.com
- Optimized form fields based on her website services
- Added referral tracking for word-of-mouth
- Added photo upload UI (storage pending)
- Added contact preference field

## Questions to Ask Client
1. Does she want email notifications when leads come in?
2. What info does she need to give an estimate?
3. Does she want to keep her current phone number or get a new Twilio number?
4. Would she pay for Twilio (~$1-2/month) for auto-text replies?

