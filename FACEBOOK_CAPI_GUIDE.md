# Facebook Conversions API (CAPI) - Complete Setup Guide

## ✅ What's Been Fixed

This guide documents the comprehensive Facebook CAPI implementation for Break Free App, including all fixes applied to ensure events show up in Facebook Events Manager.

### Issues Addressed

1. **✓ Environment Variables**: Strict validation with no fallbacks - app will fail loudly if missing
2. **✓ Enhanced Logging**: Detailed debug output in development mode (hidden in production)
3. **✓ Diagnostic Routes**: Added `/debug/test-capi` and `/debug/health` for easy testing
4. **✓ Payload Format**: Verified all event payloads follow Meta's CAPI specification
5. **✓ CORS Support**: Cross-origin requests properly configured
6. **✓ Error Handling**: Improved error responses with actionable details
7. **✓ IP Detection**: Trust proxy configured for accurate user IP behind Replit's infrastructure

---

## 📋 Prerequisites

You need the following from your Facebook Business account:

1. **Pixel ID** - Your Facebook Pixel identifier (numeric string)
2. **Access Token** - Long-lived access token from Meta Business
3. **Test Event Code** (Optional) - For testing events in Events Manager

### How to Get Your Credentials

#### 1. Get Your Pixel ID
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager/)
2. Select your Pixel
3. Click "Settings" → Copy the **Pixel ID**

#### 2. Generate Access Token
1. Go to [Meta Business Settings](https://business.facebook.com/settings/)
2. Go to "System Users" → Create a new system user (or use existing)
3. Add the user to your Ad Account with "Standard Access"
4. Generate a token with these permissions:
   - `ads_management`
   - `business_management`
5. **IMPORTANT**: Save this token immediately - you won't see it again!

#### 3. Get Test Event Code (Optional but Recommended)
1. In Facebook Events Manager → Select your Pixel
2. Click "Test Events" tab
3. Click "Test server events"
4. Copy the **Test Event Code** (format: `TEST12345`)

---

## ⚙️ Configuration

### 1. Set Environment Variables in Replit

1. Open your Replit project
2. Click on "Tools" → "Secrets" (or the lock icon in the sidebar)
3. Add these three secrets:

```
FB_PIXEL_ID=1234567890123456
FB_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FB_TEST_EVENT_CODE=TEST12345
```

**CRITICAL**: 
- Do NOT add quotes around the values
- Do NOT include spaces
- Do NOT commit these to git

### 2. Verify Configuration

Run the healthcheck endpoint to verify your setup:

```bash
curl https://break-free-app.com/api/facebook-capi/debug/health
```

Expected response:
```json
{
  "ok": true,
  "timestamp": "2025-01-15T17:00:00.000Z",
  "facebook": {
    "pixelIdDefined": true,
    "pixelIdValue": "1234...3456",
    "tokenDefined": true,
    "tokenLength": 180,
    "testEventCode": "CONFIGURED"
  },
  "server": {
    "nodeEnv": "development",
    "requestIp": "123.456.789.012",
    "trustProxy": true
  }
}
```

---

## 🧪 Testing Your Integration

### Step 1: Run Diagnostic Test

Visit the diagnostic endpoint in your browser:

```
https://break-free-app.com/api/facebook-capi/debug/test-capi
```

Or use curl:

```bash
curl https://break-free-app.com/api/facebook-capi/debug/test-capi
```

**What this does:**
- Sends a hard-coded "Purchase" event to Facebook
- Uses test data (no real user information)
- Returns detailed response from Facebook
- Shows exactly what was sent

**Expected Response:**
```json
{
  "success": true,
  "message": "Diagnostic test event sent to Facebook CAPI",
  "testEventDetails": {
    "eventName": "Purchase",
    "eventSourceUrl": "https://break-free-app.com/debug-test",
    "hasEmail": true,
    "purchaseValue": 9.99,
    "currency": "EUR"
  },
  "facebookResponse": {
    "events_received": 1,
    "messages": [],
    "fbtrace_id": "AbCdEfGh123456789"
  },
  "instructions": "Check Facebook Events Manager → Test Events tab..."
}
```

### Step 2: Verify in Facebook Events Manager

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager/)
2. Select your Pixel
3. Click **"Test Events"** tab (if you set `FB_TEST_EVENT_CODE`)
   - OR click **"Overview"** tab (if no test code)
4. You should see a "Purchase" event appear within 1-2 minutes
5. Event details should show:
   - Event: Purchase
   - Source: Server
   - Value: €9.99
   - Currency: EUR

**Troubleshooting if events don't appear:**
- Check server logs for error messages
- Verify FB_PIXEL_ID matches your actual pixel
- Verify FB_ACCESS_TOKEN hasn't expired
- Check that your pixel is active in Events Manager
- Try removing FB_TEST_EVENT_CODE temporarily

---

## 📡 Event Endpoints

All event endpoints accept POST requests with JSON payloads.

### Base URL
```
https://break-free-app.com/api/facebook-capi
```

### 1. ViewContent (Page View)
**Endpoint:** `POST /view`

**When to use:** User views a quiz page

**Payload:**
```json
{
  "url": "https://break-free-app.com/quiz",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fbclid": "fb.1.1234567890.AbCdEf",
  "fbp": "_fbp.cookie.value"
}
```

### 2. Lead (Email Submission)
**Endpoint:** `POST /lead`

**When to use:** User submits contact form

**Payload:**
```json
{
  "url": "https://break-free-app.com/quiz",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 3. InitiateCheckout
**Endpoint:** `POST /initiate-checkout`

**When to use:** User reaches checkout page

**Payload:**
```json
{
  "url": "https://break-free-app.com/checkout",
  "email": "user@example.com",
  "firstName": "John",
  "value": 14.99,
  "currency": "EUR",
  "contentName": "Healing Guides"
}
```

### 4. AddPaymentInfo
**Endpoint:** `POST /payment-info`

**When to use:** User interacts with payment form

**Payload:**
```json
{
  "url": "https://break-free-app.com/checkout",
  "email": "user@example.com",
  "firstName": "John"
}
```

### 5. Purchase
**Endpoint:** `POST /purchase`

**When to use:** Payment completed successfully

**Payload:**
```json
{
  "url": "https://break-free-app.com/success",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "value": 14.99,
  "currency": "EUR",
  "contentName": "Healing Guides Collection"
}
```

---

## 🔍 Debugging & Monitoring

### Development Logs

In development mode, every event shows detailed logging:

```
📤 Sending Facebook CAPI Event:
  Event: Purchase
  Event ID: 1234567890-abc123
  Source URL: https://break-free-app.com/checkout
  Event Time: 2025-01-15T17:00:00.000Z
  User Data Present:
    - Email: Yes (d8b5c2a1...)
    - Phone: No
    - First Name: Yes
    - Last Name: Yes
    - IP Address: 123.456.789.012
    - User Agent: Yes (142 chars)
    - FBC: fb.1.1234567890.AbCdEf
    - FBP: _fbp.1.1234567890.123456789
  Custom Data: {
    "value": 14.99,
    "currency": "EUR",
    "content_name": "Healing Guides"
  }

✅ Facebook Response:
  Events Received: 1
  FB Trace ID: AbCdEfGh123456789
```

### Check Retry Queue

Failed events are automatically retried up to 3 times:

```bash
curl https://break-free-app.com/api/facebook-capi/queue
```

Response:
```json
{
  "queueSize": 0,
  "events": []
}
```

If `queueSize > 0`, check the server logs for error details.

---

## 🚨 Common Issues & Solutions

### Issue: Events not appearing in Events Manager

**Solutions:**
1. Verify pixel ID: Run `/debug/health` and confirm it matches your pixel
2. Check access token: Token might be expired - generate a new one
3. Test event code: Remove `FB_TEST_EVENT_CODE` and check "Overview" tab instead
4. Wait time: Events can take 1-5 minutes to appear
5. Check server logs: Look for error messages with Facebook error details

### Issue: "Missing environment variables" error

**Solution:**
1. Go to Replit Secrets
2. Verify `FB_PIXEL_ID` and `FB_ACCESS_TOKEN` are set
3. Restart the Replit workspace
4. The app will NOT start without these

### Issue: Token expired error

**Solution:**
1. Generate a new long-lived access token from Meta Business
2. Update `FB_ACCESS_TOKEN` in Replit Secrets
3. Restart the server

### Issue: Events showing as "browser" instead of "server"

**Solution:**
- This means the browser pixel is firing, not CAPI
- Verify your frontend is calling the `/api/facebook-capi/*` endpoints
- Check network tab in browser DevTools for API calls

### Issue: CORS errors in browser console

**Solution:**
- CORS is configured for `break-free-app.com`
- If using a different domain, add it to the CORS whitelist in `server/index.ts`

---

## 📊 Event Matching Quality

Facebook uses these fields to match events to users:

**High Quality Matching** (Use as many as possible):
- ✅ Email (always hashed with SHA256)
- ✅ Phone (always hashed with SHA256)
- ✅ First Name + Last Name (both hashed)
- ✅ FBC (from `fbclid` URL parameter)
- ✅ FBP (from `_fbp` cookie)
- ✅ Client IP Address
- ✅ Client User Agent

**How to improve event matching:**
1. Always send email when available
2. Pass fbclid from URL to backend
3. Pass _fbp cookie from frontend
4. Include first and last name from forms
5. Let the server detect IP and User Agent automatically

---

## 🎯 Frontend Integration Example

Your frontend is already integrated via `client/src/lib/facebook-tracking.ts`:

```typescript
import { trackPurchase } from '@/lib/facebook-tracking';

// After successful payment
trackPurchase({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  value: 14.99,
  currency: 'EUR',
  contentName: 'Healing Guides'
});
```

The utility functions handle:
- Extracting `fbclid` from URL
- Reading `_fbp` cookie
- Calling the backend API endpoints
- Error handling

---

## ✨ Best Practices

1. **Always use server-side events** - More reliable than browser pixel
2. **Send events immediately** - Don't batch or delay
3. **Include as much user data as possible** - Better matching = better attribution
4. **Test with Test Event Code first** - Verify before going live
5. **Monitor the retry queue** - Failed events indicate configuration issues
6. **Use diagnostic endpoint regularly** - Quick health check

---

## 📞 Support & Resources

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Events Manager](https://business.facebook.com/events_manager/)
- [Meta Business Settings](https://business.facebook.com/settings/)
- [Troubleshooting Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/troubleshooting)

---

## 🔐 Security Notes

- All PII (email, phone, names) is automatically hashed with SHA256 before sending
- Access tokens are never logged or exposed in responses
- Trust proxy is enabled for accurate IP detection
- CORS restricts requests to authorized domains

---

## 📝 Change Log

**2025-01-15: Complete Overhaul**
- ✓ Removed fallback environment variables (fail-fast approach)
- ✓ Added detailed development logging (production logs are minimal)
- ✓ Created `/debug/test-capi` diagnostic endpoint
- ✓ Created `/debug/health` healthcheck endpoint
- ✓ Enhanced error messages with Facebook error details
- ✓ Verified payload format matches Meta CAPI spec
- ✓ Added CORS support for cross-domain requests
- ✓ Improved retry queue with better error tracking
- ✓ Integrated tracking into frontend quiz flow

---

## ✅ Verification Checklist

Use this checklist to verify your integration:

- [ ] Environment variables set in Replit Secrets
- [ ] `/debug/health` returns `ok: true`
- [ ] `/debug/test-capi` sends event successfully
- [ ] Test event appears in Events Manager within 5 minutes
- [ ] Real quiz completion triggers ViewContent event
- [ ] Contact form submission triggers Lead event
- [ ] Checkout page triggers InitiateCheckout event
- [ ] Payment form interaction triggers AddPaymentInfo event
- [ ] Successful payment triggers Purchase event
- [ ] Events show as "Server" source in Events Manager
- [ ] Event matching quality is "Good" or higher

---

**Need help?** Check the server logs for detailed error messages or run the diagnostic test endpoint.
