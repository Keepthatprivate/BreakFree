import FacebookCAPI from '../server/facebook-capi';

const pixelId = process.env.FB_PIXEL_ID || '';
const accessToken = process.env.FB_ACCESS_TOKEN || '';

if (!pixelId || !accessToken) {
  console.error('ERROR: FB_PIXEL_ID and FB_ACCESS_TOKEN environment variables are required');
  process.exit(1);
}

const fbCAPI = new FacebookCAPI(pixelId, accessToken);

async function runTests() {
  console.log('=== Meta CAPI Test Suite ===\n');
  
  // Wait for validation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const testEmail = 'test@example.com';
  const testEventId = `test_${Date.now()}`;
  const sourceUrl = 'https://test.example.com';
  
  const userData = {
    email: testEmail,
    firstName: 'Test',
  };
  
  console.log('1. Testing ViewContent event...');
  try {
    const viewResult = await fbCAPI.sendViewContent(
      `${sourceUrl}/quiz`,
      userData,
      { content_name: 'Test - Funnel Step 01' }
    );
    console.log('   ✓ ViewContent sent');
    console.log(`   Response: ${JSON.stringify(viewResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ ViewContent failed: ${err.message}\n`);
  }

  console.log('2. Testing Lead event...');
  try {
    const leadResult = await fbCAPI.sendLead(
      `${sourceUrl}/contact`,
      userData
    );
    console.log('   ✓ Lead sent');
    console.log(`   Response: ${JSON.stringify(leadResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ Lead failed: ${err.message}\n`);
  }

  console.log('3. Testing InitiateCheckout event...');
  try {
    const checkoutResult = await fbCAPI.sendInitiateCheckout(
      `${sourceUrl}/checkout`,
      userData,
      { value: 9.99, currency: 'USD', content_name: '7-Day Trial' }
    );
    console.log('   ✓ InitiateCheckout sent');
    console.log(`   Response: ${JSON.stringify(checkoutResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ InitiateCheckout failed: ${err.message}\n`);
  }

  console.log('4. Testing AddPaymentInfo event...');
  try {
    const paymentResult = await fbCAPI.sendAddPaymentInfo(
      `${sourceUrl}/payment`,
      userData
    );
    console.log('   ✓ AddPaymentInfo sent');
    console.log(`   Response: ${JSON.stringify(paymentResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ AddPaymentInfo failed: ${err.message}\n`);
  }

  console.log('5. Testing Purchase event...');
  try {
    const purchaseResult = await fbCAPI.sendPurchase(
      `${sourceUrl}/success`,
      userData,
      { value: 49.99, currency: 'USD', content_name: 'Premium Subscription' }
    );
    console.log('   ✓ Purchase sent');
    console.log(`   Response: ${JSON.stringify(purchaseResult)}\n`);
  } catch (err: any) {
    console.log(`   ✗ Purchase failed: ${err.message}\n`);
  }

  console.log('=== Test Complete ===');
  console.log('Check your Meta Events Manager to verify events were received.');
}

runTests().catch(console.error);
