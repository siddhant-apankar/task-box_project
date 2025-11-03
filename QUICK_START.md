# Quick Start Guide - TaskBox Backend & Frontend

## Prerequisites Checklist
- [ ] Java 17+ installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] MySQL 8.0+ installed and running
- [ ] Text editor/IDE (VS Code, IntelliJ, etc.)

---

## 5-Minute Setup

### 1. Setup Database (2 minutes)

```bash
# Start MySQL
mysql -u root -p

# Run this SQL
CREATE DATABASE taskbox_db;
USE taskbox_db;
SOURCE taskbox-backend/src/main/resources/database_schema.sql;
```

Or use MySQL Workbench:
- Connect to MySQL
- Open `taskbox-backend/src/main/resources/database_schema.sql`
- Execute the script

### 2. Configure Backend (1 minute)

Edit `taskbox-backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

### 3. Start Backend (1 minute)

```bash
cd taskbox-backend
mvn spring-boot:run
```

Wait for: `Started TaskboxBackendApplication`

### 4. Start Frontend Server (30 seconds)

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000
```

### 5. Test (30 seconds)

1. Open: http://localhost:8000
2. Click "Sign Up"
3. Register a student
4. Login with credentials

---

## Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Change `server.port=8081` in `application.properties` |
| MySQL connection error | Check password in `application.properties` |
| CORS error | Verify backend is running on port 8080 |
| Frontend shows blank | Open via http:// (not file://) |

---

## File Locations

```
Project Root/
├── index.html          ← Frontend
├── app.js              ← Frontend logic
├── style.css           ← Frontend styles
├── taskbox-backend/    ← Backend Spring Boot
│   ├── pom.xml
│   └── src/
└── SETUP_INSTRUCTIONS.md ← Full guide
```

---

## Next Steps After Setup

1. ✅ Test registration and login
2. 📝 Read `FRONTEND_INTEGRATION.md` for API integration
3. 🚀 Add more features (assignments, submissions, etc.)

---

## Need Help?

- Check `SETUP_INSTRUCTIONS.md` for detailed steps
- Check backend console for errors
- Check browser console (F12) for frontend errors

