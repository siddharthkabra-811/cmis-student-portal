/**
 * Test script for the login API
 * Usage: node test-api.js
 */

const http = require('http');

const testCases = [
  {
    name: 'Test 1: Missing email',
    body: { password: 'test123' },
    expectedStatus: 400
  },
  {
    name: 'Test 2: Missing password',
    body: { email: 'test@tamu.edu' },
    expectedStatus: 400
  },
  {
    name: 'Test 3: Valid request format',
    body: { email: 'test@tamu.edu', password: 'test123' },
    expectedStatus: 401 // Will fail auth but should reach our endpoint
  },
  {
    name: 'Test 4: Empty body',
    body: {},
    expectedStatus: 400
  }
];

function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testCase.body);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            body: jsonData,
            testCase
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            testCase
          });
        }
      });
    });

    req.on('error', (e) => {
      reject({ error: e.message, testCase });
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Login API\n');
  console.log('='.repeat(60));

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log(`Request body: ${JSON.stringify(testCase.body)}`);
      
      const result = await makeRequest(testCase);
      
      console.log(`Status: ${result.status} (Expected: ${testCase.expectedStatus})`);
      console.log(`Response: ${JSON.stringify(result.body, null, 2)}`);
      
      if (result.status === testCase.expectedStatus) {
        console.log('✅ Test passed');
      } else {
        console.log('❌ Test failed - Status mismatch');
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.error || error.message}`);
    }
    
    console.log('-'.repeat(60));
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✨ Tests completed!\n');
}

runTests();

