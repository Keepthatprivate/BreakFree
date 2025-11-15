# Facebook Conversions API Setup

## Overview
Your quiz app now includes Facebook Conversions API (CAPI) integration for server-side tracking of user events. This provides more accurate conversion tracking than client-side Pixel alone.

## Environment Variables Required

Add these to your Replit Secrets:

```
FB_PIXEL_ID=24998264096489706
FB_ACCESS_TOKEN=EAAfsK32I1ZAUBPZCnbgIahZCFZBBoMMS1rjvrZBCiMH3DP9LFLuHPL1SUJ5SBzZBWZBt79WT6CzbgttENdmK9ZBrWI6XSjn6BP5ExDvsZAf2XbT7m1eryIXeTwcPiixAwHR3h8Rj5JDwZCUgmO8pTqeLvGvvclsueZAw2C53PjwuLfZBmMeoOqBddJqKNKZCI3FcqtQZDZD
FB_TEST_EVENT_CODE=(optional - for testing events in Facebook Events Manager)
```

## API Endpoints

All endpoints are prefixed with `/api/facebook-capi/`

### 1. ViewContent - Track Page Views
```bash
POST /api/facebook-capi/view
Content-Type: application/json

{
  "url": "https://break-free-app.com/quiz",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "fbclid": "abc123",  // from URL parameter
  "fbp": "_fbp_cookie_value"  // from cookie
}
```

### 2. Lead - User Provides Email
```bash
POST /api/facebook-capi/lead
Content-Type: application/json

{
  "url": "https://break-free-app.com/quiz",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "fbclid": "abc123",
  "fbp": "_fbp_cookie_value"
}
```

### 3. InitiateCheckout - Checkout Page View
```bash
POST /api/facebook-capi/initiate-checkout
Content-Type: application/json

{
  "url": "https://break-free-app.com/checkout",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "value": 14.99,
  "currency": "EUR",
  "contentName": "Healing Guides",
  "fbclid": "abc123",
  "fbp": "_fbp_cookie_value"
}
```

### 4. AddPaymentInfo - User Enters Payment Details
```bash
POST /api/facebook-capi/payment-info
Content-Type: application/json

{
  "url": "https://break-free-app.com/checkout",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fbclid": "abc123",
  "fbp": "_fbp_cookie_value"
}
```

### 5. Purchase - Completed Transaction
```bash
POST /api/facebook-capi/purchase
Content-Type: application/json

{
  "url": "https://break-free-app.com/success",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "value": 14.99,
  "currency": "EUR",
  "contentName": "Healing Guides Purchase",
  "fbclid": "abc123",
  "fbp": "_fbp_cookie_value"
}
```

## Debug Endpoints

### View Retry Queue
```bash
GET /api/facebook-capi/queue
```
Returns failed events waiting to be retried.

### Test Event
```bash
POST /api/facebook-capi/test-event
```
Sends a test PageView event to verify setup.

## Features

✅ **Automatic Data Hashing**: All user data (email, phone, names) is SHA256 hashed before sending to Facebook
✅ **Retry Queue**: Failed events are automatically retried up to 3 times
✅ **IP & User Agent Detection**: Automatically captured from requests
✅ **fbclid Support**: Converts fbclid URL parameter to fbc format
✅ **Error Logging**: All errors are logged for debugging

## How It Works

1. **Client sends event** to your backend endpoint
2. **Backend hashes user data** using SHA256
3. **Event is sent to Facebook** via Graph API
4. **If failed**, event is added to retry queue
5. **Retry queue processes** every 30 seconds

## Testing

1. Add the environment variables to Replit Secrets
2. Use the test endpoint:
```bash
curl -X POST https://break-free-app.com/api/facebook-capi/test-event
```
3. Check Facebook Events Manager for the test event
4. Monitor retry queue:
```bash
curl https://break-free-app.com/api/facebook-capi/queue
```

## Next Steps

To integrate with your frontend, call these endpoints when users:
- View quiz pages → `/view`
- Submit email → `/lead`
- Land on checkout → `/initiate-checkout`
- Start entering payment → `/payment-info`
- Complete purchase → `/purchase`

Remember to include `fbclid` from URL parameters and `fbp` cookie if available!
