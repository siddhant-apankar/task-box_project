# Complete Setup Guide: TaskBox Backend + Frontend + Database

This guide will walk you through setting up the complete TaskBox application with Spring Boot backend, MySQL database, and connecting it to the frontend.

---

## Part 1: Database Setup (MySQL)

### Step 1: Install MySQL
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server (include MySQL Workbench)
3. During installation, set a root password (remember this!)

### Step 2: Create Database
1. Open MySQL Workbench or command line
2. Connect to MySQL server (username: `root`, password: your password)
3. Run the SQL script:

**Option A: Using MySQL Workbench**
- Open MySQL Workbench
- Click "New Query Tab"
- Open file: `taskbox-backend/src/main/resources/database_schema.sql`
- Click Execute (⚡ icon)

**Option B: Using Command Line**
```bash
mysql -u root -p
# Enter your password when prompted

# Then run:
source taskbox-backend/src/main/resources/database_schema.sql
# OR
mysql -u root -p taskbox_db < taskbox-backend/src/main/resources/database_schema.sql
```

### Step 3: Verify Database
```sql
USE taskbox_db;
SHOW TABLES;
```
You should see tables: users, students, teachers, subjects, assignments, etc.

---

## Part 2: Backend Setup (Spring Boot)

### Step 1: Prerequisites Check
```bash
# Check Java version (need Java 17+)
java -version

# Check Maven (need 3.6+)
mvn -version
```

**If Java/Maven not installed:**
- Java: Download from https://adoptium.net/
- Maven: Download from https://maven.apache.org/download.cgi

### Step 2: Configure Database Connection
1. Open `taskbox-backend/src/main/resources/application.properties`
2. Update these lines:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

### Step 3: Build and Run Backend

**Method 1: Command Line**
```bash
cd taskbox-backend
mvn clean install
mvn spring-boot:run
```

**Method 2: IDE (IntelliJ IDEA/Eclipse)**
1. Open `taskbox-backend` folder in IDE
2. Wait for Maven to download dependencies
3. Find `TaskboxBackendApplication.java`
4. Right-click → Run

**Method 3: JAR File**
```bash
cd taskbox-backend
mvn clean package
java -jar target/taskbox-backend-1.0.0.jar
```

### Step 4: Verify Backend is Running
- Check console: Should see "Started TaskboxBackendApplication"
- Open browser: http://localhost:8080
- You should see a white page (or error page, which is fine)
- Check logs for "Tomcat started on port(s): 8080"

---

## Part 3: Frontend Setup and Connection

### Step 1: Update Frontend to Use Backend API

Edit `app.js` and add this at the top:

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let authToken = localStorage.getItem('token') || null;

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, error: error.message };
  }
}
```

### Step 2: Update Login Functions

Replace the `loginWithPassword` function in `app.js`:

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
    });
    
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
      
      showToast('✅ Login successful! Welcome ' + name, 'success');
      closeAuthModal();
      
      if (currentRole === 'student') {
        showStudentDashboard();
      } else {
        showTeacherDashboard();
      }
    } else {
      errorDiv.textContent = '❌ ' + (result.data.error || 'Invalid credentials');
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    errorDiv.textContent = '❌ Network error. Check if backend is running.';
    errorDiv.style.display = 'block';
  }
}
```

### Step 3: Update Registration Function

Add this function to `app.js`:

```javascript
async function handleRegistration(event) {
  event.preventDefault();
  
  try {
    let endpoint, payload;
    
    if (selectedRegRole === 'student') {
      endpoint = '/auth/register/student';
      payload = {
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        mobile: document.getElementById('studentMobile').value.trim(),
        enrollmentNo: document.getElementById('studentEnrollment').value.trim() || null,
        branch: document.getElementById('studentBranch').value,
        semester: parseInt(document.getElementById('studentSemester').value),
        password: document.getElementById('studentPassword').value
      };
    } else {
      endpoint = '/auth/register/teacher';
      payload = {
        name: document.getElementById('teacherName').value.trim(),
        email: document.getElementById('teacherEmail').value.trim(),
        mobile: document.getElementById('teacherMobile').value.trim(),
        employeeId: document.getElementById('teacherEmployeeId').value.trim() || null,
        department: document.getElementById('teacherDepartment').value,
        password: document.getElementById('teacherPassword').value
      };
    }
    
    const result = await apiCall(endpoint, 'POST', payload);
    
    if (result.ok) {
      showToast('✅ Registration successful! Please login.', 'success');
      setTimeout(() => {
        closeAuthModal();
        showAuthPage('login');
      }, 1500);
    } else {
      showToast('❌ ' + (result.data.error || 'Registration failed'), 'error');
    }
  } catch (error) {
    showToast('❌ Network error: ' + error.message, 'error');
  }
}
```

### Step 4: Serve Frontend via HTTP Server

The frontend must be served via HTTP (not file://) to make API calls.

**Option 1: Python HTTP Server**
```bash
# Navigate to frontend directory
cd "D:\New folder\New folder"

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js http-server**
```bash
# Install globally
npm install -g http-server

# Run server
cd "D:\New folder\New folder"
http-server -p 8000
```

**Option 3: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Click "Open with Live Server"

### Step 5: Access Application
- Frontend: http://localhost:8000 (or port shown by server)
- Backend API: http://localhost:8080

---

## Part 4: Testing the Complete System

### Test 1: Register a Student
1. Open frontend: http://localhost:8000
2. Click "Sign Up"
3. Fill student registration form
4. Submit
5. Check backend console for logs
6. Check database: `SELECT * FROM users; SELECT * FROM students;`

### Test 2: Login
1. Click "Login"
2. Use registered email/mobile and password
3. Should redirect to dashboard
4. Check browser console for API calls

### Test 3: Create Assignment (Teacher)
1. Register as teacher
2. Login
3. Create assignment
4. Check database: `SELECT * FROM assignments;`

---

## Troubleshooting

### Problem: Backend won't start
**Solution:**
- Check Java version: `java -version` (need 17+)
- Check MySQL is running
- Check port 8080 is not in use
- Check `application.properties` has correct database credentials
- Look at error logs in console

### Problem: Database connection error
**Solution:**
```sql
-- Check MySQL is running
mysql -u root -p

-- Check database exists
SHOW DATABASES;

-- Check user permissions
SELECT User, Host FROM mysql.user;
```

### Problem: CORS errors in browser
**Solution:**
- Ensure `WebConfig.java` exists with CORS configuration
- Check backend is running on port 8080
- Check frontend is accessing correct API URL
- Clear browser cache

### Problem: Frontend can't connect to backend
**Solution:**
- Verify backend is running: http://localhost:8080
- Check browser console for errors
- Verify API_BASE_URL in frontend code
- Check firewall settings

### Problem: Registration/login not working
**Solution:**
- Check browser Network tab for API requests
- Verify request payload is correct
- Check backend console for errors
- Verify database tables exist

---

## Quick Start Commands Summary

```bash
# 1. Start MySQL
# Windows: net start MySQL80
# Linux/Mac: sudo systemctl start mysql

# 2. Create database (in MySQL)
mysql -u root -p
source taskbox-backend/src/main/resources/database_schema.sql

# 3. Start Backend
cd taskbox-backend
mvn spring-boot:run

# 4. Start Frontend Server (new terminal)
cd "D:\New folder\New folder"
python -m http.server 8000

# 5. Open Browser
# Frontend: http://localhost:8000
# Backend: http://localhost:8080
```

---

## Next Steps After Setup

1. **Test all features**: Register, login, create assignments, submit work
2. **Add sample data**: Create subjects, assignments manually or via API
3. **Implement file uploads**: For assignment submissions
4. **Add JWT authentication**: Replace simple token with JWT
5. **Add validation**: Frontend and backend validation
6. **Deploy**: Deploy to cloud (AWS, Heroku, etc.)

---

## Important Files

- **Database Schema**: `taskbox-backend/src/main/resources/database_schema.sql`
- **Backend Config**: `taskbox-backend/src/main/resources/application.properties`
- **Main Application**: `taskbox-backend/src/main/java/com/taskbox/TaskboxBackendApplication.java`
- **Frontend**: `index.html`, `app.js`, `style.css`

---

## Support

If you encounter issues:
1. Check error logs in backend console
2. Check browser console (F12 → Console)
3. Check Network tab in browser (F12 → Network)
4. Verify all prerequisites are installed
5. Ensure MySQL is running and accessible

Good luck! 🚀

