# Email Configuration Setup Guide

## Gmail SMTP Setup (5 minutes)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Scroll to **2-Step Verification** → Click **Get Started**
4. Follow the prompts to enable it (SMS or Google Authenticator)

### Step 2: Generate App Password
1. After 2-Step is enabled, go back to **Security**
2. Scroll to **App passwords** (appears only after 2-Step is on)
3. Select:
   - App: **Mail**
   - Device: **Windows Computer**
4. Click **Generate**
5. Copy the **16-character password** (e.g. `abcd efgh ijkl mnop`)

### Step 3: Update application.properties
Open: `backend/src/main/resources/application.properties`

Replace these two lines:
```
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

Example:
```
spring.mail.username=john.doe@gmail.com
spring.mail.password=abcdefghijklmnop
```

### Step 4: Restart Backend
```bash
cd backend
mvn spring-boot:run
```

---

## Email Template Preview

When a user books a room, they receive:

```
┌─────────────────────────────────────────────┐
│  🏨                                         │
│  Booking Confirmed!                         │
│  Your reservation is all set               │
│  [✅ CONFIRMED]                             │
├─────────────────────────────────────────────┤
│  Hi John! 👋                                │
│  Thank you for choosing StayEase           │
│                                            │
│  ┌───────────────────────────────────┐     │
│  │  RESERVATION NUMBER                │     │
│  │  STE-000007                        │     │
│  └───────────────────────────────────┘     │
│                                            │
│  🏨 Hotel Details                          │
│  Hotel:    The Grand Chennai               │
│  Address:  12 Anna Salai, Chennai          │
│  Room:     DOUBLE Room                     │
│                                            │
│  📅 Stay Details                           │
│  Check-in:  2026-04-29                     │
│  Check-out: 2026-04-30                     │
│  Duration:  1 night                        │
│                                            │
│  💰 Payment Summary                        │
│  Room Price:  ₹5000 × 1 nights             │
│  Promo:       🏷️ SUMMER20                  │
│  ─────────────────────────────────         │
│  Total Paid:  ₹4000                        │
│                                            │
│  [View My Bookings]                        │
│                                            │
│  Need help? Reply to this email            │
├─────────────────────────────────────────────┤
│  🏨 StayEase Hotel Booking                 │
│  This is an automated confirmation         │
│  © 2026 StayEase. All rights reserved.     │
└─────────────────────────────────────────────┘
```

---

## Testing Without Real Email

If you don't want to set up Gmail, the booking still works — email just fails silently in the background. The `@Async` annotation ensures email failure never blocks the booking.

To test email locally without sending:
1. Check backend console logs — you'll see: `⚠️ Email send failed (booking still confirmed): ...`
2. The booking is saved in DB regardless

---

## Alternative: Use Mailtrap (Free Testing)

If you want to test emails without spamming real inboxes:

1. Sign up at https://mailtrap.io (free)
2. Get SMTP credentials from dashboard
3. Update `application.properties`:
```
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=YOUR_MAILTRAP_USERNAME
spring.mail.password=YOUR_MAILTRAP_PASSWORD
```

All emails go to Mailtrap inbox — you can see the HTML preview there.
