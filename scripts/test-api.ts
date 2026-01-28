/**
 * API Testing Script for Mini CRM Backend
 * This script tests all endpoints to ensure they work correctly
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];
let adminToken: string = '';
let employeeToken: string = '';
let createdCustomerId: string = '';
let createdTaskId: string = '';

// Helper function to make HTTP requests
async function makeRequest(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
): Promise<any> {
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
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    throw { error: (error as Error).message, duration };
  }
}

// Test function wrapper
async function test(
  name: string,
  method: string,
  endpoint: string,
  body?: any,
  token?: string,
  expectedStatus: number = 200
): Promise<any> {
  try {
    const result = await makeRequest(method, endpoint, body, token);
    
    if (result.status === expectedStatus) {
      results.push({
        endpoint: `${method} ${endpoint}`,
        method,
        status: 'PASS',
        statusCode: result.status,
        duration: result.duration,
      });
      console.log(`✅ ${name} (${result.duration}ms)`);
      return result.data;
    } else {
      results.push({
        endpoint: `${method} ${endpoint}`,
        method,
        status: 'FAIL',
        statusCode: result.status,
        error: `Expected ${expectedStatus}, got ${result.status}`,
        duration: result.duration,
      });
      console.log(`❌ ${name} - Expected ${expectedStatus}, got ${result.status}`);
      return null;
    }
  } catch (err: any) {
    results.push({
      endpoint: `${method} ${endpoint}`,
      method,
      status: 'FAIL',
      error: err.error || err.message,
      duration: err.duration,
    });
    console.log(`❌ ${name} - ${err.error || err.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 Starting API Tests for Mini CRM Backend');
  console.log('═══════════════════════════════════════════════\n');

  // Test 1: Health Check
  console.log('📊 Health Check:');
  await test('Health Check', 'GET', '/health');

  // Test 2: Authentication - Register Admin
  console.log('\n🔐 Authentication Tests:');
  const adminData = await test(
    'Register Admin User',
    'POST',
    '/auth/register',
    {
      name: 'Test Admin',
      email: 'testadmin@test.com',
      password: 'admin123',
      role: 'ADMIN',
    },
    undefined,
    201
  );

  // Test 3: Register Employee
  const employeeData = await test(
    'Register Employee User',
    'POST',
    '/auth/register',
    {
      name: 'Test Employee',
      email: 'testemployee@test.com',
      password: 'employee123',
      role: 'EMPLOYEE',
    },
    undefined,
    201
  );

  // Test 4: Login Admin
  const adminLogin = await test(
    'Login as Admin',
    'POST',
    '/auth/login',
    {
      email: 'testadmin@test.com',
      password: 'admin123',
    }
  );
  if (adminLogin?.token) {
    adminToken = adminLogin.token;
  }

  // Test 5: Login Employee
  const employeeLogin = await test(
    'Login as Employee',
    'POST',
    '/auth/login',
    {
      email: 'testemployee@test.com',
      password: 'employee123',
    }
  );
  if (employeeLogin?.token) {
    employeeToken = employeeLogin.token;
  }

  // Test 6: Login with wrong password
  await test(
    'Login with Wrong Password',
    'POST',
    '/auth/login',
    {
      email: 'testadmin@test.com',
      password: 'wrongpassword',
    },
    undefined,
    401
  );

  // Test 7-9: Users Module (Admin Only)
  console.log('\n👥 Users Module Tests:');
  await test('Get All Users (Admin)', 'GET', '/users', undefined, adminToken);
  
  if (employeeData?.id) {
    await test('Get User by ID (Admin)', 'GET', `/users/${employeeData.id}`, undefined, adminToken);
  }

  await test('Get All Users (Employee - Should Fail)', 'GET', '/users', undefined, employeeToken, 403);

  // Test 10-15: Customers Module
  console.log('\n🏢 Customers Module Tests:');
  const customer = await test(
    'Create Customer (Admin)',
    'POST',
    '/customers',
    {
      name: 'Test Customer Corp',
      email: 'test@customer.com',
      phone: '+1-555-9999',
      company: 'Test Corp',
    },
    adminToken,
    201
  );
  
  if (customer?.id) {
    createdCustomerId = customer.id;
  }

  await test('Create Customer (Employee - Should Fail)', 'POST', '/customers', {
    name: 'Another Customer',
    email: 'another@customer.com',
    phone: '+1-555-8888',
  }, employeeToken, 403);

  await test('Get All Customers (Admin)', 'GET', '/customers?page=1&limit=10', undefined, adminToken);
  
  await test('Get All Customers (Employee)', 'GET', '/customers?page=1&limit=10', undefined, employeeToken);

  if (createdCustomerId) {
    await test('Get Customer by ID (Admin)', 'GET', `/customers/${createdCustomerId}`, undefined, adminToken);
    
    await test('Update Customer (Admin)', 'PATCH', `/customers/${createdCustomerId}`, {
      name: 'Updated Customer Corp',
      company: 'Updated Corp',
    }, adminToken);

    await test('Update Customer (Employee - Should Fail)', 'PATCH', `/customers/${createdCustomerId}`, {
      name: 'Try Update',
    }, employeeToken, 403);
  }

  // Test 16-19: Tasks Module
  console.log('\n📋 Tasks Module Tests:');
  if (createdCustomerId && employeeData?.id) {
    const task = await test(
      'Create Task (Admin)',
      'POST',
      '/tasks',
      {
        title: 'Test Task',
        description: 'This is a test task',
        assignedToId: employeeData.id,
        customerId: createdCustomerId,
      },
      adminToken,
      201
    );
    
    if (task?.id) {
      createdTaskId = task.id;
    }
  }

  await test('Create Task (Employee - Should Fail)', 'POST', '/tasks', {
    title: 'Employee Task',
    description: 'Should fail',
    assignedToId: employeeData?.id,
    customerId: createdCustomerId,
  }, employeeToken, 403);

  await test('Get All Tasks (Admin)', 'GET', '/tasks', undefined, adminToken);
  
  await test('Get All Tasks (Employee - Only Assigned)', 'GET', '/tasks', undefined, employeeToken);

  if (createdTaskId) {
    await test('Update Task Status', 'PATCH', `/tasks/${createdTaskId}/status`, {
      status: 'IN_PROGRESS',
    }, employeeToken);
  }

  // Test 20: Delete Customer (should be last)
  if (createdCustomerId) {
    await test('Delete Customer (Admin)', 'DELETE', `/customers/${createdCustomerId}`, undefined, adminToken);
    
    await test('Get Deleted Customer (Should Fail)', 'GET', `/customers/${createdCustomerId}`, undefined, adminToken, 404);
  }

  // Test 21: Unauthorized Access
  console.log('\n🔒 Authorization Tests:');
  await test('Access Protected Route Without Token', 'GET', '/users', undefined, undefined, 401);

  // Print Summary
  console.log('\n═══════════════════════════════════════════════');
  console.log('📊 Test Summary:');
  console.log('═══════════════════════════════════════════════');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  // Average response time
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + (r.duration || 0), 0) / results.filter(r => r.duration).length;
  
  console.log(`⚡ Avg Response Time: ${avgDuration.toFixed(0)}ms`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`   ${r.endpoint} - ${r.error}`);
      });
  }
  
  console.log('\n✨ Testing completed!\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
