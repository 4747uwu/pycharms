# 🔐 How to Use Authentication in Swagger UI

## Problem: Getting 401 Unauthorized Error

If you're seeing `401 Unauthorized` errors when trying to access protected endpoints like `/users`, it means you haven't authorized your requests with the JWT token.

## ✅ Solution: Authorize in Swagger UI

### Step 1: Login and Get Token

1. Open Swagger UI: http://localhost:3000/api-docs
2. Scroll down to **Authentication** section
3. Expand `POST /auth/login`
4. Click **"Try it out"**
5. Enter your credentials:
   ```json
   {
     "email": "admin@crmapp.com",
     "password": "admin123"
   }
   ```
6. Click **"Execute"**
7. **Copy the token** from the response (it will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Authorize in Swagger

1. **Look at the top-right corner** of the Swagger page
2. You should see a **green "Authorize" button** with a lock icon 🔓
3. **Click the "Authorize" button**
4. A popup will appear with a field labeled **"bearerAuth (http, Bearer)"**
5. **Paste your token** in the "Value" field
   - You can enter it with or without "Bearer " prefix
   - Just the token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Or with Bearer: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
6. Click **"Authorize"** button in the popup
7. Click **"Close"**

### Step 3: Test Protected Endpoints

Now all your requests will include the authentication header automatically!

1. Try `GET /users` endpoint
2. Click **"Try it out"**
3. Click **"Execute"**
4. You should now get **200 OK** with user data! ✅

---

## 🔄 Important Notes

### Token Expiration
- Tokens expire after **7 days** (as configured in .env)
- If you get 401 after some time, login again to get a new token
- Re-authorize with the new token

### Logout / Deauthorize
- To logout, click the **"Authorize"** button again
- Click **"Logout"** button next to bearerAuth
- This will remove the token from all requests

### Different User Roles
- **Admin**: Full access to all endpoints
- **Employee**: Limited access (can view customers and assigned tasks)

---

## 🧪 Quick Test with cURL

If Swagger isn't working, you can test with cURL:

```bash
# 1. Login and get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crmapp.com",
    "password": "admin123"
  }'

# Response will contain: {"token": "eyJhbGc..."}

# 2. Use the token in subsequent requests
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Test Credentials (After Running Seed Script)

### Admin Account
- **Email**: `admin@crmapp.com`
- **Password**: `admin123`
- **Access**: All endpoints

### Employee Accounts
- **Email**: `john.smith@crmapp.com`, `sarah.johnson@crmapp.com`, `mike.wilson@crmapp.com`
- **Password**: `employee123` (for all)
- **Access**: Limited (view customers, assigned tasks only)

---

## 🐛 Still Having Issues?

If the Authorize button is not visible:
1. Make sure the server is running: `npm run dev`
2. Refresh the Swagger page: http://localhost:3000/api-docs
3. Clear browser cache and reload
4. Try a different browser

If you're getting 401 even after authorizing:
1. Check that you copied the complete token (no spaces or line breaks)
2. Verify the token hasn't expired
3. Make sure you're using a valid admin account for admin-only endpoints
4. Check the terminal logs for error messages
