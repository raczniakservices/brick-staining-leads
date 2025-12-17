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

---

# BUSINESS/MARKETING - Lead Capture Service Business

## Pricing Strategy

**Recommended Pricing:**
- **Setup Fee:** $597 (one-time)
- **Monthly Fee:** $147/month (includes hosting, Twilio costs, SMS costs, support)

**What's Included in Monthly:**
- Hosting on Render
- Twilio phone number (~$1/month)
- All SMS costs (within reasonable usage)
- Dashboard access
- Ongoing support and maintenance

**Market Research:**
- Freelancers charge $300-$1,000 for basic landing pages (no SMS)
- Agencies charge $1,500-$5,000+ for full solutions
- Our price: $597 setup + $147/month = competitive, includes SMS automation
- Monthly recurring revenue is the real value ($147 × 12 = $1,764/year per client)

## Service Structure

**Base Package:**
- Custom branded landing page
- Form capture system
- Admin dashboard to view leads
- Mobile responsive design
- Hosting included

**Optional Upgrades (offer after base is set up):**
- Automated text responses (Twilio integration)
- Email notifications
- Additional integrations

**Important:** Test Twilio integration yourself first before offering it to clients.

## Facebook Post (Final Version)

```
I'm opening a limited beta for custom lead capture landing pages.

I'm taking three to five clients to start. This is a selective launch before I expand to more businesses.

The base package includes a custom branded landing page that matches your business style and branding. Customers visit the page and fill out a form with their contact information, service needs, and project details.

All submitted information appears in a dashboard you can access anytime. You never miss a lead.

The pages work on mobile and desktop. They're designed to convert visitors into leads.

This works best for service businesses that get leads through phone calls and referrals. Contractors, home services, service companies. If your customers need to request quotes or schedule consultations, this captures those leads automatically.

Optional upgrades include automated text responses and other integrations. We can discuss those after the base landing page is set up.

I also build custom tools and automation for businesses. If you have something else in mind beyond these landing pages, we can discuss whether it's a fit. I focus on business tools and automation, not full websites.

The examples below show different industries and styles I've built. Each one is custom designed to match the business.

If you're interested, send me a message. I'll show you how it would work for your specific business and we can discuss whether it's a fit.

Limited spots available.
```

**Post with:** 5 demo screenshots (roofing, cleaning, auto-detailing, landscaping, photography)

## DM Conversation Template

**When they message you:**

```
Thanks for reaching out.

I build custom lead capture landing pages for service businesses. Here's an example of what they look like:

[Send screenshot of relevant demo]

The base package includes:
- Custom branded landing page matching your business
- Form that captures customer information
- Admin dashboard to view all leads
- Mobile responsive design
- Hosting and maintenance included

Optional upgrades:
- Automated text responses (when customers text/call, they get form link automatically)
- Email notifications when new leads come in
- Additional integrations based on your needs

Pricing:
$597 one-time setup fee
$147 per month (includes hosting, all costs, and support)

The monthly fee covers everything. No hidden costs.

What type of business do you run? I can show you a more relevant example based on your industry.
```

## Demo Landing Pages Created

Located in: `lead-capture-system/demos/`

1. **roofing.html** - Summit Roofing Co. (Navy/red, professional)
2. **cleaning.html** - Sparkle Home Cleaning (Mint green, clean)
3. **auto-detailing.html** - Elite Auto Detailing (Black/gold, premium) - USER'S FAVORITE
4. **landscaping.html** - Green Valley Landscaping (Forest green, earthy)
5. **photography.html** - Aura Photography (Black/gold, minimal/editorial)

**Key Design Principles:**
- No emoji icons
- Professional, clean design
- Package/service selection visible (not hidden in dropdowns)
- Industry-specific branding
- Mobile responsive

## Render Free Tier Notes

**Limitations:**
- Free tier spins down after 15 min inactivity
- ~50 second delay on first cold request
- Fine for lead capture forms (customers don't notice)
- Upgrade later if traffic gets heavy

## Twilio Setup Strategy

**Important:** Test Twilio integration yourself first before offering to clients.

**Setup:**
1. Get Twilio account
2. Purchase phone number (~$1/month)
3. Set up webhook to send form link when people text/call
4. Test thoroughly with your own number
5. Only offer after proven to work

**Costs to Client:**
- Include in monthly fee ($147/month)
- You absorb Twilio costs (they're small)
- Cleaner pricing model

## Marketing Strategy

**Focus:**
- Start with just landing pages (base package)
- Don't promise Twilio until tested
- Offer upgrades after base is proven
- Build testimonials with first 3-5 clients
- Then expand to more clients

**Boundaries:**
- Focus on business tools and automation
- NOT full websites
- NOT competitor analysis (yet)
- Keep it simple, master one thing first

## Next Steps

1. Post Facebook ad with 5 demo screenshots
2. When DMs come in, use conversation template
3. Show relevant demo, discuss pricing
4. Get first 3-5 clients
5. Test Twilio integration yourself
6. Once proven, offer as upgrade
7. Collect testimonials
8. Expand to more clients

