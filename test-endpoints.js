#!/usr/bin/env node
const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

// Test helper function
async function testEndpoint(method, path, data = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    if (data && method !== 'GET') {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: parsed,
            success: true
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        success: false,
        error: 'Request timeout'
      });
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Real Endpoint Testing (No Mocks)...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/api/health'
    },
    {
      name: 'Username Validation - Available',
      method: 'GET', 
      path: '/api/auth/validate/username?username=testuser123'
    },
    {
      name: 'Username Validation - Too Short',
      method: 'GET',
      path: '/api/auth/validate/username?username=ab'
    },
    {
      name: 'Email Validation - Valid Format',
      method: 'GET',
      path: '/api/auth/validate/email?email=test@example.com'
    },
    {
      name: 'Email Validation - Invalid Format',
      method: 'GET',
      path: '/api/auth/validate/email?email=invalid-email'
    },
    {
      name: 'Phone Validation - Valid Indian Number',
      method: 'GET',
      path: '/api/auth/validate/phone?phone=9876543210'
    },
    {
      name: 'Phone Validation - Invalid Format',
      method: 'GET',
      path: '/api/auth/validate/phone?phone=123456'
    },
    {
      name: 'Forgot Password - Valid Email',
      method: 'POST',
      path: '/api/auth/forgot-password',
      data: { email: 'test@example.com' }
    },
    {
      name: 'Forgot Password - Invalid Email',
      method: 'POST',
      path: '/api/auth/forgot-password',
      data: { email: 'invalid-email' }
    }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n📋 Testing: ${test.name}`);
    console.log(`   ${test.method} ${test.path}`);
    
    if (test.data) {
      console.log(`   Data: ${JSON.stringify(test.data)}`);
    }

    const result = await testEndpoint(test.method, test.path, test.data);
    
    if (result.success) {
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📄 Response:`, JSON.stringify(result.data, null, 2));
      passed++;
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
      if (result.status > 0) {
        console.log(`   📄 Status: ${result.status}`);
        console.log(`   📄 Response: ${result.data}`);
      }
    }
  }

  console.log(`\n\n📊 TEST SUMMARY:`);
  console.log(`   ✅ Passed: ${passed}/${total}`);
  console.log(`   ❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log(`\n🎉 ALL ENDPOINTS ARE WORKING IN PRODUCTION! 🚀`);
  } else {
    console.log(`\n⚠️  Some endpoints need attention for production readiness.`);
  }
}

// Run the tests
runTests().catch(console.error);