# TaskBox Backend - Spring Boot API

## Overview
This is the backend API for TaskBox, an academic assignment management system built with Spring Boot.

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0 or higher
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Step-by-Step Setup Instructions

### Step 1: Install MySQL Database

1. **Download and Install MySQL**
   - Download MySQL from: https://dev.mysql.com/downloads/mysql/
   - Install MySQL Server and MySQL Workbench

2. **Start MySQL Server**
   ```bash
   # Windows: Start MySQL service from Services
   # Or from command line:
   net start MySQL80
   
   # Linux/Mac:
   sudo systemctl start mysql
   # or
   sudo service mysql start
   ```

3. **Access MySQL**
   ```bash
   mysql -u root -p
   ```

4. **Create Database**
   ```sql
   CREATE DATABASE taskbox_db;
   USE taskbox_db;
   ```

5. **Run Database Schema**
   - Open MySQL Workbench or command line
   - Execute the SQL script: `src/main/resources/database_schema.sql`
   ```bash
   mysql -u root -p taskbox_db < src/main/resources/database_schema.sql
   ```

### Step 2: Configure Database Connection

1. **Edit `application.properties`**
   - Open `src/main/resources/application.properties`
   - Update the following:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/taskbox_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### Step 3: Build and Run the Application

**Option A: Using Maven Command Line**
```bash
cd taskbox-backend
mvn clean install
mvn spring-boot:run
```

**Option B: Using IDE**
1. Open the project in IntelliJ IDEA or Eclipse
2. Wait for Maven to download dependencies
3. Right-click on `TaskboxBackendApplication.java`
4. Select "Run" or "Debug"

**Option C: Using Java Command**
```bash
cd taskbox-backend
mvn clean package
java -jar target/taskbox-backend-1.0.0.jar
```

### Step 4: Verify the Application

The backend should start on: `http://localhost:8080`

Test the API:
```bash
curl http://localhost:8080/api/auth/login
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with password
- `POST /api/auth/register/student` - Register student
- `POST /api/auth/register/teacher` - Register teacher
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/{id}` - Get assignment by ID
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/student/{studentId}` - Get assignments for student

### Submissions
- `GET /api/submissions/assignment/{assignmentId}` - Get submissions for assignment
- `GET /api/submissions/student/{studentId}` - Get student submissions
- `POST /api/submissions` - Create/update submission
- `PUT /api/submissions/{submissionId}/grade` - Grade submission

## Connecting Frontend to Backend

### Step 1: Update Frontend API Configuration

Create or update `app.js` to use the backend API:

```javascript
// Add at the top of app.js
const API_BASE_URL = 'http://localhost:8080/api';

// Example: Update loginWithPassword function
async function loginWithPassword(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('passwordEmailMobile').value.trim();
  const password = document.getElementById('passwordInput').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrMobile: emailMobile,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      
      currentUser = { id: data.userId, name: data.name };
      currentRole = data.role.toLowerCase();
      
      showToast('Login successful!', 'success');
      closeAuthModal();
      
      if (currentRole === 'student') {
        showStudentDashboard();
      } else {
        showTeacherDashboard();
      }
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    showToast('Network error. Please check if backend is running.', 'error');
    console.error('Error:', error);
  }
}
```

### Step 2: Serve Frontend with HTTP Server

Since the frontend makes API calls, you need to serve it via HTTP (not file://):

**Option A: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 8000
```

**Option C: Using VS Code Live Server Extension**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 3: Test the Connection

1. Start the backend: `http://localhost:8080`
2. Open frontend: `http://localhost:8000`
3. Try logging in or registering

## Troubleshooting

### Issue: Database Connection Failed
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `application.properties`
- Check database exists: `SHOW DATABASES;`

### Issue: Port 8080 Already in Use
- Change port in `application.properties`: `server.port=8081`
- Update frontend API URL accordingly

### Issue: CORS Errors
- Ensure `WebConfig.java` allows your frontend origin
- Check browser console for specific CORS errors

### Issue: Dependencies Not Found
- Run `mvn clean install` to download dependencies
- Check internet connection

## Project Structure

```
taskbox-backend/
├── src/
│   ├── main/
│   │   ├── java/com/taskbox/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── TaskboxBackendApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── database_schema.sql
│   └── test/
└── pom.xml
```

## Development Tips

1. **Enable Hot Reload**: Use Spring Boot DevTools (already included)
2. **View Database**: Use MySQL Workbench to inspect tables
3. **Check Logs**: Look at console output for errors
4. **API Testing**: Use Postman or curl to test endpoints

## Next Steps

- Implement JWT authentication properly
- Add file upload handling for submissions
- Implement notification system
- Add validation and error handling
- Create unit tests

