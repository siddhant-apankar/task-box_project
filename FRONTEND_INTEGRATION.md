# Frontend Integration Guide

This guide shows how to connect your existing frontend to the Spring Boot backend.

## Step 1: Add API Configuration to app.js

Add this code at the very top of your `app.js` file (after the variable declarations):

```javascript
// ============================================
// API CONFIGURATION - Add this at the top
// ============================================
const API_BASE_URL = 'http://localhost:8080/api';
let authToken = localStorage.getItem('token') || null;

// Helper function for making API calls
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = true) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (requiresAuth && authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      return { ok: false, data: errorData };
    }
    
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, error: error.message };
  }
}
```

## Step 2: Update loginWithPassword Function

Replace the existing `loginWithPassword` function (around line 617) with:

```javascript
async function loginWithPassword(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('passwordEmailMobile').value.trim();
  const password = document.getElementById('passwordInput').value;
  const errorDiv = document.getElementById('passwordError');
  
  try {
    const result = await apiCall('/auth/login', 'POST', {
      emailOrMobile: emailMobile,
      password: password
    }, false);
    
    if (result.ok) {
      const { token, userId, name, role } = result.data;
      
      // Store authentication data
      authToken = token;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      
      // Update global variables
      currentUser = { id: userId, name: name };
      currentRole = role.toLowerCase();
      
      showToast('✅ Login successful! Welcome ' + name, 'success');
      closeAuthModal();
      
      if (currentRole === 'student') {
        showStudentDashboard();
      } else {
        showTeacherDashboard();
      }
    } else {
      errorDiv.textContent = '❌ ' + (result.data?.error || 'Invalid credentials');
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    errorDiv.textContent = '❌ Network error. Check if backend is running.';
    errorDiv.style.display = 'block';
    console.error('Login error:', error);
  }
}
```

## Step 3: Update handleRegistration Function

Replace the existing `handleRegistration` function (around line 724) with:

```javascript
async function handleRegistration(event) {
  event.preventDefault();
  
  try {
    let endpoint, payload;
    
    if (selectedRegRole === 'student') {
      // Validate mobile format
      const mobile = document.getElementById('studentMobile').value.trim();
      if (!/^[0-9]{10}$/.test(mobile)) {
        showToast('❌ Mobile number must be exactly 10 digits!', 'error');
        return;
      }
      
      endpoint = '/auth/register/student';
      payload = {
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        mobile: mobile,
        enrollmentNo: document.getElementById('studentEnrollment').value.trim() || null,
        branch: document.getElementById('studentBranch').value,
        semester: parseInt(document.getElementById('studentSemester').value),
        password: document.getElementById('studentPassword').value
      };
      
      // Validate password match
      const password = document.getElementById('studentPassword').value;
      const confirmPassword = document.getElementById('studentConfirmPassword').value;
      if (password !== confirmPassword) {
        showToast('❌ Passwords do not match!', 'error');
        return;
      }
    } else {
      // Validate mobile format
      const mobile = document.getElementById('teacherMobile').value.trim();
      if (!/^[0-9]{10}$/.test(mobile)) {
        showToast('❌ Mobile number must be exactly 10 digits!', 'error');
        return;
      }
      
      endpoint = '/auth/register/teacher';
      payload = {
        name: document.getElementById('teacherName').value.trim(),
        email: document.getElementById('teacherEmail').value.trim(),
        mobile: mobile,
        employeeId: document.getElementById('teacherEmployeeId').value.trim() || null,
        department: document.getElementById('teacherDepartment').value,
        password: document.getElementById('teacherPassword').value
      };
      
      // Validate password match
      const password = document.getElementById('teacherPassword').value;
      const confirmPassword = document.getElementById('teacherConfirmPassword').value;
      if (password !== confirmPassword) {
        showToast('❌ Passwords do not match!', 'error');
        return;
      }
    }
    
    const result = await apiCall(endpoint, 'POST', payload, false);
    
    if (result.ok) {
      showToast('✅ Registration successful! Please login.', 'success');
      setTimeout(() => {
        closeAuthModal();
        showAuthPage('login');
      }, 1500);
    } else {
      showToast('❌ ' + (result.data?.error || 'Registration failed'), 'error');
    }
  } catch (error) {
    showToast('❌ Network error: ' + error.message, 'error');
    console.error('Registration error:', error);
  }
}
```

## Step 4: Update sendOTP Function

Replace the `sendOTP` function (around line 392) with:

```javascript
async function sendOTP(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('otpEmailMobile').value.trim();
  const method = document.querySelector('input[name="otpMethod"]:checked').value;
  
  try {
    const result = await apiCall('/auth/otp/send', 'POST', {
      emailOrMobile: emailMobile
    }, false);
    
    if (result.ok) {
      // Store OTP for verification (for testing)
      otpStorage.code = result.data.otp; // Remove in production
      otpStorage.email = emailMobile.includes('@') ? emailMobile : null;
      otpStorage.mobile = emailMobile.includes('@') ? null : emailMobile;
      otpStorage.method = method;
      otpStorage.expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes
      otpStorage.attempts = 0;
      otpStorage.type = 'login';
      
      // Show step 2
      document.getElementById('otpRequestForm').style.display = 'none';
      document.getElementById('otpVerifyForm').style.display = 'block';
      document.getElementById('step1').classList.remove('active');
      document.getElementById('step2').classList.add('active');
      
      const destination = method === 'email' ? emailMobile : emailMobile;
      document.getElementById('otpSentMessage').textContent = 
        `OTP sent to ${destination}. Check console for testing OTP: ${result.data.otp}`;
      
      showToast(`OTP sent! Check console for testing OTP.`, 'success');
      startOTPTimer();
      
      // Enable resend after 30 seconds
      document.getElementById('resendBtn').disabled = true;
      resendTimeout = setTimeout(() => {
        document.getElementById('resendBtn').disabled = false;
      }, 30000);
    } else {
      showToast('❌ ' + (result.data?.error || 'Failed to send OTP'), 'error');
    }
  } catch (error) {
    showToast('❌ Network error. Check if backend is running.', 'error');
    console.error('OTP send error:', error);
  }
}
```

## Step 5: Update verifyOTP Function

Replace the `verifyOTP` function (around line 481) with:

```javascript
async function verifyOTP(event) {
  event.preventDefault();
  
  const enteredOTP = document.getElementById('otpCode').value.trim();
  const emailMobile = otpStorage.email || otpStorage.mobile;
  const errorDiv = document.getElementById('otpError');
  
  try {
    const result = await apiCall('/auth/otp/verify', 'POST', {
      emailOrMobile: emailMobile,
      otpCode: enteredOTP
    }, false);
    
    if (result.ok) {
      const { token, userId, name, role } = result.data;
      
      // Store authentication data
      authToken = token;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      
      currentUser = { id: userId, name: name };
      currentRole = role.toLowerCase();
      
      showToast('Login successful! Welcome ' + name, 'success');
      closeAuthModal();
      
      // Clear OTP storage
      otpStorage = {
        code: null,
        email: null,
        mobile: null,
        method: null,
        expiresAt: null,
        attempts: 0,
        maxAttempts: 3,
        type: 'login'
      };
      
      if (currentRole === 'student') {
        showStudentDashboard();
      } else {
        showTeacherDashboard();
      }
    } else {
      otpStorage.attempts++;
      const remainingAttempts = otpStorage.maxAttempts - otpStorage.attempts;
      errorDiv.textContent = `❌ ${result.data?.error || 'Invalid OTP'}. ${remainingAttempts} attempt(s) remaining.`;
      errorDiv.style.display = 'block';
      
      if (remainingAttempts === 0) {
        document.getElementById('otpCode').disabled = true;
      }
    }
  } catch (error) {
    errorDiv.textContent = '❌ Network error. Check if backend is running.';
    errorDiv.style.display = 'block';
    console.error('OTP verify error:', error);
  }
}
```

## Step 6: Load User Data on Page Load

Add this at the end of `app.js` (after all other functions):

```javascript
// ============================================
// INITIALIZE - Load saved user session
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('token');
  const savedUserId = localStorage.getItem('userId');
  const savedUserName = localStorage.getItem('userName');
  const savedUserRole = localStorage.getItem('userRole');
  
  if (savedToken && savedUserId) {
    authToken = savedToken;
    currentUser = { id: savedUserId, name: savedUserName };
    currentRole = savedUserRole?.toLowerCase();
    
    // Auto-show dashboard if user was logged in
    if (currentRole === 'student') {
      showStudentDashboard();
    } else if (currentRole === 'teacher') {
      showTeacherDashboard();
    }
  }
});
```

## Step 7: Update Logout Function

Replace the `confirmLogout` function (around line 985) with:

```javascript
function confirmLogout() {
  // Close modal
  closeLogoutModal();
  
  // Clear authentication data
  authToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  
  // Clear all user session data
  currentUser = null;
  currentRole = null;
  selectedAssignmentId = null;
  selectedSubmissionData = null;
  
  // Clear all timers
  currentTimers.forEach(timer => clearInterval(timer));
  currentTimers = [];
  
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
    otpTimerInterval = null;
  }
  if (resendTimeout) {
    clearTimeout(resendTimeout);
    resendTimeout = null;
  }
  
  // Clear OTP storage
  otpStorage = {
    code: null,
    email: null,
    mobile: null,
    method: null,
    expiresAt: null,
    attempts: 0,
    maxAttempts: 3,
    type: 'login'
  };
  
  resetOtpStorage = {
    code: null,
    userId: null,
    expiresAt: null,
    attempts: 0
  };
  
  // Hide all dashboard pages
  document.getElementById('mainHeader').style.display = 'none';
  document.getElementById('studentDashboard').style.display = 'none';
  document.getElementById('teacherDashboard').style.display = 'none';
  document.getElementById('assignmentDetails').style.display = 'none';
  document.getElementById('createAssignmentPage').style.display = 'none';
  document.getElementById('evaluatePage').style.display = 'none';
  document.getElementById('leaderboardPage').style.display = 'none';
  document.getElementById('dashboardFooter').style.display = 'none';
  document.getElementById('notificationPanel').style.display = 'none';
  
  // Close any open modals
  closeAuthModal();
  closeGradeModal();
  closeNotificationModal();
  
  // Show landing page
  document.getElementById('landingPage').style.display = 'flex';
  
  // Reset notification badge
  document.getElementById('notificationBadge').textContent = '0';
  document.getElementById('notificationBadge').style.display = 'none';
  
  // Show success message
  showToast('✅ Logged out successfully! See you soon.', 'success');
}
```

## Testing the Integration

1. **Start Backend**: Make sure Spring Boot is running on http://localhost:8080
2. **Serve Frontend**: Use HTTP server (not file://)
3. **Test Registration**: Try registering a new student
4. **Test Login**: Login with registered credentials
5. **Check Browser Console**: Look for API calls in Network tab (F12)

## Important Notes

- **CORS**: The backend is configured to accept requests from http://localhost:8000
- **Authentication**: Currently using simple token (replace with JWT in production)
- **Error Handling**: All API calls should handle errors gracefully
- **Loading States**: Consider adding loading indicators during API calls

## Next Steps

After basic integration works:
1. Implement fetching assignments from backend
2. Implement submission functionality
3. Add notification fetching
4. Implement comments system
5. Add proper error handling and loading states

