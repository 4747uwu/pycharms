/**
 * Load Testing Script for Mini CRM Backend
 * Tests API performance under concurrent requests
 */

const BASE_URL = 'http://localhost:3000';

interface LoadTestConfig {
  endpoint: string;
  method: string;
  body?: any;
  token?: string;
  concurrentRequests: number;
  totalRequests: number;
}

interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  totalDuration: number;
}

let adminToken: string = '';

async function makeRequest(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
): Promise<{ duration: number; status: number }> {
  const startTime = Date.now();
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const duration = Date.now() - startTime;
    await response.json(); // consume response
    
    return {
      duration,
      status: response.status,
    };
  } catch (error) {
    return {
      duration: Date.now() - startTime,
      status: 0,
    };
  }
}

async function runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
  const results: { duration: number; status: number }[] = [];
  const startTime = Date.now();
  
  const batches = Math.ceil(config.totalRequests / config.concurrentRequests);
  
  for (let i = 0; i < batches; i++) {
    const batchSize = Math.min(
      config.concurrentRequests,
      config.totalRequests - i * config.concurrentRequests
    );
    
    const promises = Array.from({ length: batchSize }, () =>
      makeRequest(config.method, config.endpoint, config.body, config.token)
    );
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Progress indicator
    const progress = ((i + 1) / batches * 100).toFixed(0);
    process.stdout.write(`\r   Progress: ${progress}% (${results.length}/${config.totalRequests})`);
  }
  
  console.log(''); // New line after progress
  
  const totalDuration = Date.now() - startTime;
  const successfulResults = results.filter(r => r.status >= 200 && r.status < 300);
  const durations = results.map(r => r.duration);
  
  return {
    totalRequests: results.length,
    successfulRequests: successfulResults.length,
    failedRequests: results.length - successfulResults.length,
    averageResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
    minResponseTime: Math.min(...durations),
    maxResponseTime: Math.max(...durations),
    requestsPerSecond: (results.length / totalDuration) * 1000,
    totalDuration,
  };
}

async function setupTestData(): Promise<void> {
  console.log('🔧 Setting up test data...');
  
  // Login as admin
  const loginResponse = await makeRequest('POST', '/auth/login', {
    email: 'admin@crmapp.com',
    password: 'admin123',
  });
  
  if (loginResponse.status === 200) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@crmapp.com',
        password: 'admin123',
      }),
    });
    const data = await response.json();
    adminToken = data.token;
    console.log('✅ Admin token obtained');
  } else {
    console.log('❌ Failed to obtain admin token. Make sure to run seed script first.');
    process.exit(1);
  }
}

async function runAllLoadTests() {
  console.log('\n⚡ Starting Load Tests for Mini CRM Backend');
  console.log('═══════════════════════════════════════════════\n');

  await setupTestData();

  // Test 1: Health Check Endpoint
  console.log('📊 Test 1: Health Check Endpoint');
  const healthTest = await runLoadTest({
    endpoint: '/health',
    method: 'GET',
    concurrentRequests: 50,
    totalRequests: 500,
  });
  printResults(healthTest);

  // Test 2: Login Endpoint
  console.log('\n🔐 Test 2: Login Endpoint (Authentication)');
  const loginTest = await runLoadTest({
    endpoint: '/auth/login',
    method: 'POST',
    body: {
      email: 'admin@crmapp.com',
      password: 'admin123',
    },
    concurrentRequests: 20,
    totalRequests: 200,
  });
  printResults(loginTest);

  // Test 3: Get Customers (with auth)
  console.log('\n🏢 Test 3: Get Customers (Authenticated)');
  const customersTest = await runLoadTest({
    endpoint: '/customers?page=1&limit=10',
    method: 'GET',
    token: adminToken,
    concurrentRequests: 30,
    totalRequests: 300,
  });
  printResults(customersTest);

  // Test 4: Get Tasks (with auth)
  console.log('\n📋 Test 4: Get Tasks (Authenticated)');
  const tasksTest = await runLoadTest({
    endpoint: '/tasks',
    method: 'GET',
    token: adminToken,
    concurrentRequests: 30,
    totalRequests: 300,
  });
  printResults(tasksTest);

  // Test 5: Get Users (with auth)
  console.log('\n👥 Test 5: Get Users (Authenticated)');
  const usersTest = await runLoadTest({
    endpoint: '/users',
    method: 'GET',
    token: adminToken,
    concurrentRequests: 30,
    totalRequests: 300,
  });
  printResults(usersTest);

  // Overall Summary
  console.log('\n═══════════════════════════════════════════════');
  console.log('📊 Overall Summary:');
  console.log('═══════════════════════════════════════════════');
  
  const allTests = [healthTest, loginTest, customersTest, tasksTest, usersTest];
  const totalRequests = allTests.reduce((sum, test) => sum + test.totalRequests, 0);
  const totalSuccessful = allTests.reduce((sum, test) => sum + test.successfulRequests, 0);
  const avgResponseTime = allTests.reduce((sum, test) => sum + test.averageResponseTime, 0) / allTests.length;
  
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Successful: ${totalSuccessful} (${((totalSuccessful / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`\n✅ All endpoints performing ${avgResponseTime < 100 ? 'excellently' : avgResponseTime < 200 ? 'well' : 'adequately'}`);
  
  if (avgResponseTime < 50) {
    console.log('🏆 Achievement Unlocked: Sub-50ms average response time!');
  }
  
  console.log('\n✨ Load testing completed!\n');
}

function printResults(result: LoadTestResult) {
  console.log('   ─────────────────────────────────────');
  console.log(`   Total Requests:       ${result.totalRequests}`);
  console.log(`   ✅ Successful:        ${result.successfulRequests} (${((result.successfulRequests / result.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`   ❌ Failed:            ${result.failedRequests}`);
  console.log(`   ⚡ Avg Response:      ${result.averageResponseTime.toFixed(0)}ms`);
  console.log(`   ⬇️  Min Response:      ${result.minResponseTime}ms`);
  console.log(`   ⬆️  Max Response:      ${result.maxResponseTime}ms`);
  console.log(`   🚀 Requests/sec:      ${result.requestsPerSecond.toFixed(1)}`);
  console.log(`   ⏱️  Total Duration:    ${(result.totalDuration / 1000).toFixed(2)}s`);
}

// Run load tests
runAllLoadTests().catch(err => {
  console.error('❌ Load test execution failed:', err);
  process.exit(1);
});
