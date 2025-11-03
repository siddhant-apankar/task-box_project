// Data Storage (In-Memory)
let currentUser = null;
let currentRole = null;
let selectedAssignmentId = null;
let selectedSubmissionData = null;
let currentTimers = [];

// OTP Storage
let otpStorage = {
  code: null,
  email: null,
  mobile: null,
  method: null,
  expiresAt: null,
  attempts: 0,
  maxAttempts: 3,
  type: 'login' // 'login' or 'reset'
};

let resetOtpStorage = {
  code: null,
  userId: null,
  expiresAt: null,
  attempts: 0
};

let resendTimeout = null;
let otpTimerInterval = null;
let selectedRegRole = 'student';

// Sample Data
const subjects = [
  {
    id: 'SUB001',
    name: 'Applied Mathematics Thinking',
    code: 'SUBJ001',
    credits: 3,
    teacher: 'Dr. Rajesh Kumar'
  },
  {
    id: 'SUB002',
    name: 'Advance Data Structure & Analysis',
    code: 'SUBJ002',
    credits: 3,
    teacher: 'Prof. Priya Sharma'
  },
  {
    id: 'SUB003',
    name: 'Database Management System',
    code: 'SUBJ003',
    credits: 3,
    teacher: 'Dr. Amit Patel'
  },
  {
    id: 'SUB004',
    name: 'Automata Theory',
    code: 'SUBJ004',
    credits: 3,
    teacher: 'Prof. Neha Desai'
  }
];

const students = [
  { id: 'STU001', name: 'Aarav Singh', email: 'aarav.singh@taskbox.edu', mobile: '9876554320', enrollmentNo: 'TB-2025001', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Advanced' },
  { id: 'STU002', name: 'Priya Patel', email: 'priya.patel@taskbox.edu', mobile: '9876554321', enrollmentNo: 'TB-2025002', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Advanced' },
  { id: 'STU003', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@taskbox.edu', mobile: '9876554322', enrollmentNo: 'TB-2025003', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Average' },
  { id: 'STU004', name: 'Anjali Verma', email: 'anjali.verma@taskbox.edu', mobile: '9876554323', enrollmentNo: 'TB-2025004', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Average' },
  { id: 'STU005', name: 'Vikram Gupta', email: 'vikram.gupta@taskbox.edu', mobile: '9876554324', enrollmentNo: 'TB-2025005', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Average' },
  { id: 'STU006', name: 'Neha Malhotra', email: 'neha.malhotra@taskbox.edu', mobile: '9876554325', enrollmentNo: 'TB-2025006', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Slow' },
  { id: 'STU007', name: 'Arjun Reddy', email: 'arjun.reddy@taskbox.edu', mobile: '9876554326', enrollmentNo: 'TB-2025007', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Slow' },
  { id: 'STU008', name: 'Sakshi Joshi', email: 'sakshi.joshi@taskbox.edu', mobile: '9876554327', enrollmentNo: 'TB-2025008', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Slow' },
  { id: 'STU009', name: 'Harsh Mishra', email: 'harsh.mishra@taskbox.edu', mobile: '9876554328', enrollmentNo: 'TB-2025009', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Average' },
  { id: 'STU010', name: 'Divya Nair', email: 'divya.nair@taskbox.edu', mobile: '9876554329', enrollmentNo: 'TB-2025010', branch: 'IT', semester: 3, password: 'Student@123', learnerLevel: 'Slow' }
];

const teachers = [
  { id: 'TEA001', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@taskbox.edu', mobile: '9876543210', subjects: ['SUB001'], password: 'Teacher@123' },
  { id: 'TEA002', name: 'Prof. Priya Sharma', email: 'priya.sharma@taskbox.edu', mobile: '9876543211', subjects: ['SUB002'], password: 'Teacher@123' },
  { id: 'TEA003', name: 'Dr. Amit Patel', email: 'amit.patel@taskbox.edu', mobile: '9876543212', subjects: ['SUB003', 'SUB004'], password: 'Teacher@123' }
];

const assignments = [
  {
    id: 'ASSGN001',
    title: 'Linear Algebra Assignment',
    description: 'Solve problems on Matrix operations, Eigenvalues, and Eigenvectors. Show all working steps.',
    subjectId: 'SUB001',
    dueDate: new Date('2025-11-05T23:59:00'),
    totalMarks: 25,
    createdBy: 'TEA001',
    createdAt: new Date('2025-10-20T10:00:00'),
    learnerTypes: ['Average', 'Advanced'],
    difficulty: 'Medium'
  },
  {
    id: 'ASSGN002',
    title: 'Calculus Problem Set',
    description: 'Complete exercises on Differential Equations and Integration techniques.',
    subjectId: 'SUB001',
    dueDate: new Date('2025-11-12T23:59:00'),
    totalMarks: 30,
    createdBy: 'TEA001',
    createdAt: new Date('2025-10-22T10:00:00'),
    learnerTypes: ['Advanced'],
    difficulty: 'Hard'
  },
  {
    id: 'ASSGN003',
    title: 'Graph Algorithms Implementation',
    description: 'Implement BFS, DFS, Dijkstra\'s algorithm and analyze time complexity. Submit code with documentation.',
    subjectId: 'SUB002',
    dueDate: new Date('2025-11-03T23:59:00'),
    totalMarks: 40,
    createdBy: 'TEA002',
    createdAt: new Date('2025-10-18T10:00:00'),
    learnerTypes: ['Advanced'],
    difficulty: 'Hard'
  },
  {
    id: 'ASSGN004',
    title: 'Tree Data Structures',
    description: 'Implement AVL Tree, Red-Black Tree with insertion and deletion operations.',
    subjectId: 'SUB002',
    dueDate: new Date('2025-11-08T23:59:00'),
    totalMarks: 35,
    createdBy: 'TEA002',
    createdAt: new Date('2025-10-21T10:00:00'),
    learnerTypes: ['Average', 'Advanced'],
    difficulty: 'Medium'
  },
  {
    id: 'ASSGN005',
    title: 'SQL Queries Practice',
    description: 'Write complex SQL queries involving Joins, Subqueries, and Aggregation functions.',
    subjectId: 'SUB003',
    dueDate: new Date('2025-11-06T23:59:00'),
    totalMarks: 30,
    createdBy: 'TEA003',
    createdAt: new Date('2025-10-19T10:00:00'),
    learnerTypes: ['Average', 'Slow'],
    difficulty: 'Medium'
  },
  {
    id: 'ASSGN006',
    title: 'Database Design Project',
    description: 'Design a normalized database schema for a Library Management System. Include ER diagram and relational schema.',
    subjectId: 'SUB003',
    dueDate: new Date('2025-11-15T23:59:00'),
    totalMarks: 50,
    createdBy: 'TEA003',
    createdAt: new Date('2025-10-23T10:00:00'),
    learnerTypes: ['Advanced', 'Average', 'Slow'],
    difficulty: 'Medium'
  },
  {
    id: 'ASSGN007',
    title: 'Regular Expressions',
    description: 'Create regular expressions for given patterns and convert them to DFA.',
    subjectId: 'SUB004',
    dueDate: new Date('2025-11-04T23:59:00'),
    totalMarks: 25,
    createdBy: 'TEA003',
    createdAt: new Date('2025-10-20T10:00:00'),
    learnerTypes: ['Slow'],
    difficulty: 'Easy'
  },
  {
    id: 'ASSGN008',
    title: 'Turing Machine Design',
    description: 'Design Turing machines for basic operations and prove their correctness.',
    subjectId: 'SUB004',
    dueDate: new Date('2025-11-10T23:59:00'),
    totalMarks: 35,
    createdBy: 'TEA003',
    createdAt: new Date('2025-10-22T10:00:00'),
    learnerTypes: ['Advanced', 'Average', 'Slow'],
    difficulty: 'Medium'
  }
];

const submissions = [
  {
    id: 'SUB001',
    assignmentId: 'ASSGN001',
    studentId: 'STU001',
    submittedAt: new Date('2025-10-28T14:30:00'),
    fileName: 'Aarav_Linear_Algebra.pdf',
    fileSize: '2.3 MB',
    comments: 'Completed all problems',
    version: 1,
    isLate: false,
    marks: 23,
    feedback: 'Excellent work! Minor errors in problem 3.',
    evaluatedAt: new Date('2025-10-29T10:00:00')
  },
  {
    id: 'SUB002',
    assignmentId: 'ASSGN003',
    studentId: 'STU002',
    submittedAt: new Date('2025-10-25T20:15:00'),
    fileName: 'Priya_Graph_Algorithms.zip',
    fileSize: '1.8 MB',
    comments: 'Implemented all algorithms',
    version: 1,
    isLate: false,
    marks: 38,
    feedback: 'Great implementation! Good code structure.',
    evaluatedAt: new Date('2025-10-26T15:00:00')
  },
  {
    id: 'SUB003',
    assignmentId: 'ASSGN005',
    studentId: 'STU003',
    submittedAt: new Date('2025-11-07T08:20:00'),
    fileName: 'Rohan_SQL_Queries.sql',
    fileSize: '125 KB',
    comments: 'All queries tested',
    version: 1,
    isLate: true,
    marks: null,
    feedback: null,
    evaluatedAt: null
  },
  {
    id: 'SUB004',
    assignmentId: 'ASSGN007',
    studentId: 'STU004',
    submittedAt: new Date('2025-11-02T18:45:00'),
    fileName: 'Anjali_Regex.pdf',
    fileSize: '890 KB',
    comments: null,
    version: 1,
    isLate: false,
    marks: 22,
    feedback: 'Good work! One DFA conversion needs correction.',
    evaluatedAt: new Date('2025-11-03T11:00:00')
  }
];

const comments = [
  {
    id: 'COM001',
    assignmentId: 'ASSGN003',
    userId: 'STU002',
    userType: 'student',
    text: 'Can we use Python for implementation?',
    timestamp: new Date('2025-10-20T15:30:00')
  },
  {
    id: 'COM002',
    assignmentId: 'ASSGN003',
    userId: 'TEA002',
    userType: 'teacher',
    text: 'Yes, you can use Python or C++.',
    timestamp: new Date('2025-10-20T16:00:00')
  },
  {
    id: 'COM003',
    assignmentId: 'ASSGN005',
    userId: 'STU003',
    userType: 'student',
    text: 'Should we use MySQL or PostgreSQL?',
    timestamp: new Date('2025-10-22T10:15:00')
  }
];

const notifications = [
  {
    id: 'NOT001',
    userId: 'STU001',
    message: 'Assignment "Graph Algorithms Implementation" due in 3 days!',
    timestamp: new Date('2025-10-28T09:00:00'),
    isRead: false,
    type: 'reminder'
  },
  {
    id: 'NOT002',
    userId: 'STU001',
    message: 'Your submission for "Linear Algebra Assignment" has been graded.',
    timestamp: new Date('2025-10-29T10:00:00'),
    isRead: false,
    type: 'graded'
  }
];

// Utility Functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-IN', options);
}

function getTimeRemaining(dueDate) {
  if (!(dueDate instanceof Date)) dueDate = new Date(dueDate);
  const now = new Date();
  const diff = dueDate - now;
  
  if (diff < 0) return 'Overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function isUrgent(dueDate) {
  if (!(dueDate instanceof Date)) dueDate = new Date(dueDate);
  const now = new Date();
  const diff = dueDate - now;
  const hours = diff / (1000 * 60 * 60);
  return hours < 24 && hours > 0;
}

function getAssignmentStatus(assignment, studentId) {
  const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === studentId);
  
  if (submission) {
    if (submission.marks !== null && submission.marks !== undefined) return 'graded';
    return 'submitted';
  }
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
  
  if (daysUntilDue < 7) return 'upcoming';
  return 'ongoing';
}

// Authentication - OTP System
function showAuthPage(type) {
  closeAuthModal(); // Close any open modals first
  
  if (type === 'login') {
    document.getElementById('loginModal').style.display = 'flex';
    switchLoginTab('password'); // Default to password login
    resetOTPForm();
  } else if (type === 'signup') {
    document.getElementById('signupModal').style.display = 'flex';
    selectedRegRole = 'student';
    document.querySelectorAll('.role-toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.role-toggle-btn')[0].classList.add('active');
  }
}

function closeAuthModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('signupModal').style.display = 'none';
  document.getElementById('forgotPasswordModal').style.display = 'none';
  
  // Clear timers
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
    otpTimerInterval = null;
  }
  if (resendTimeout) {
    clearTimeout(resendTimeout);
    resendTimeout = null;
  }
  
  resetOTPForm();
}

function resetOTPForm() {
  document.getElementById('otpRequestForm').style.display = 'block';
  document.getElementById('otpVerifyForm').style.display = 'none';
  document.getElementById('step1').classList.add('active');
  document.getElementById('step2').classList.remove('active');
  document.getElementById('otpEmailMobile').value = '';
  document.getElementById('otpCode').value = '';
  document.getElementById('otpError').style.display = 'none';
  otpStorage.attempts = 0;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('otpEmailMobile').value.trim();
  const method = document.querySelector('input[name="otpMethod"]:checked').value;
  
  // Validate if user exists
  let userExists = false;
  let foundUser = null;
  
  // Check in students
  foundUser = students.find(s => s.email === emailMobile || s.mobile === emailMobile);
  if (foundUser) {
    userExists = true;
    currentRole = 'student';
  }
  
  // Check in teachers if not found
  if (!foundUser) {
    foundUser = teachers.find(t => t.email === emailMobile || t.mobile === emailMobile);
    if (foundUser) {
      userExists = true;
      currentRole = 'teacher';
    }
  }
  
  if (!userExists) {
    showToast('User not found. Please check your email/mobile or sign up.', 'error');
    return;
  }
  
  // Generate OTP
  const otp = generateOTP();
  otpStorage.code = otp;
  otpStorage.email = foundUser.email;
  otpStorage.mobile = foundUser.mobile;
  otpStorage.method = method;
  otpStorage.expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes
  otpStorage.attempts = 0;
  otpStorage.type = 'login';
  
  // Simulate sending OTP (in console for testing)
  console.log('='.repeat(50));
  console.log('OTP FOR TESTING: ' + otp);
  console.log('User: ' + foundUser.name);
  console.log('Method: ' + (method === 'email' ? 'Email' : 'SMS'));
  console.log('='.repeat(50));
  
  // Show step 2
  document.getElementById('otpRequestForm').style.display = 'none';
  document.getElementById('otpVerifyForm').style.display = 'block';
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  
  const destination = method === 'email' ? foundUser.email : foundUser.mobile;
  document.getElementById('otpSentMessage').textContent = `OTP sent to ${destination}. Check console for testing OTP.`;
  
  showToast(`OTP sent! Check console for testing OTP.`, 'success');
  
  // Start timer
  startOTPTimer();
  
  // Enable resend after 30 seconds
  document.getElementById('resendBtn').disabled = true;
  resendTimeout = setTimeout(() => {
    document.getElementById('resendBtn').disabled = false;
  }, 30000);
}

function startOTPTimer() {
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  
  otpTimerInterval = setInterval(() => {
    const remaining = otpStorage.expiresAt - Date.now();
    
    if (remaining <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('otpTimer').innerHTML = '<span style="color: var(--color-error-red);">OTP Expired. Please request new OTP.</span>';
      return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const timerClass = remaining < 60000 ? 'urgent' : '';
    
    document.getElementById('otpTimer').innerHTML = `<span class="${timerClass}">OTP expires in ${minutes}:${seconds.toString().padStart(2, '0')}</span>`;
  }, 1000);
}

function verifyOTP(event) {
  event.preventDefault();
  
  const enteredOTP = document.getElementById('otpCode').value.trim();
  const errorDiv = document.getElementById('otpError');
  
  // Check expiry
  if (Date.now() > otpStorage.expiresAt) {
    errorDiv.textContent = 'OTP has expired. Please request a new one.';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Check attempts
  if (otpStorage.attempts >= otpStorage.maxAttempts) {
    errorDiv.textContent = 'Too many failed attempts. Please request a new OTP.';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Verify OTP
  if (enteredOTP === otpStorage.code) {
    // Login successful
    let user = null;
    
    if (currentRole === 'student') {
      user = students.find(s => s.email === otpStorage.email || s.mobile === otpStorage.mobile);
    } else {
      user = teachers.find(t => t.email === otpStorage.email || t.mobile === otpStorage.mobile);
    }
    
    if (user) {
      currentUser = user;
      showToast('Login successful! Welcome ' + user.name, 'success');
      closeAuthModal();
      
      if (currentRole === 'student') {
        showStudentDashboard();
      } else {
        showTeacherDashboard();
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
    }
  } else {
    otpStorage.attempts++;
    const remainingAttempts = otpStorage.maxAttempts - otpStorage.attempts;
    errorDiv.textContent = `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`;
    errorDiv.style.display = 'block';
    
    if (remainingAttempts === 0) {
      document.getElementById('otpCode').disabled = true;
    }
  }
}

function resendOTP() {
  const emailMobile = otpStorage.email || otpStorage.mobile;
  const method = otpStorage.method;
  
  // Generate new OTP
  const otp = generateOTP();
  otpStorage.code = otp;
  otpStorage.expiresAt = Date.now() + (5 * 60 * 1000);
  otpStorage.attempts = 0;
  
  console.log('='.repeat(50));
  console.log('NEW OTP FOR TESTING: ' + otp);
  console.log('='.repeat(50));
  
  showToast('New OTP sent! Check console.', 'success');
  document.getElementById('otpError').style.display = 'none';
  document.getElementById('otpCode').value = '';
  document.getElementById('otpCode').disabled = false;
  
  // Restart timer
  startOTPTimer();
  
  // Disable resend again
  document.getElementById('resendBtn').disabled = true;
  resendTimeout = setTimeout(() => {
    document.getElementById('resendBtn').disabled = false;
  }, 30000);
}

function backToStep1() {
  resetOTPForm();
}

// Password Login Functions
function switchLoginTab(tabName) {
  const otpTab = document.getElementById('otpLoginTab');
  const passwordTab = document.getElementById('passwordLoginTab');
  const tabBtns = document.querySelectorAll('#loginModal .tab-btn');
  
  if (tabName === 'otp') {
    otpTab.style.display = 'block';
    passwordTab.style.display = 'none';
    tabBtns[0].classList.add('active');
    tabBtns[1].classList.remove('active');
    resetOTPForm();
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordLoginForm').reset();
  } else {
    otpTab.style.display = 'none';
    passwordTab.style.display = 'block';
    tabBtns[0].classList.remove('active');
    tabBtns[1].classList.add('active');
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordLoginForm').reset();
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('passwordInput');
  const btn = event.target;
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    btn.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    btn.textContent = '👁️';
  }
}

function loginWithPassword(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('passwordEmailMobile').value.trim();
  const password = document.getElementById('passwordInput').value;
  const errorDiv = document.getElementById('passwordError');
  
  // Find user
  let foundUser = null;
  let userRole = null;
  
  // Check in students
  foundUser = students.find(s => 
    (s.email === emailMobile || s.mobile === emailMobile) && s.password === password
  );
  
  if (foundUser) {
    userRole = 'student';
  } else {
    // Check in teachers
    foundUser = teachers.find(t => 
      (t.email === emailMobile || t.mobile === emailMobile) && t.password === password
    );
    
    if (foundUser) {
      userRole = 'teacher';
    }
  }
  
  if (!foundUser) {
    errorDiv.textContent = '❌ Invalid credentials. Please check your email/mobile and password.';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Login successful
  currentUser = foundUser;
  currentRole = userRole;
  
  showToast('✅ Login successful! Welcome ' + foundUser.name, 'success');
  closeAuthModal();
  
  if (userRole === 'student') {
    showStudentDashboard();
  } else {
    showTeacherDashboard();
  }
}

// Registration
function selectRole(role) {
  selectedRegRole = role;
  
  document.querySelectorAll('.role-toggle-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  if (role === 'student') {
    document.getElementById('studentSignupForm').style.display = 'block';
    document.getElementById('teacherSignupForm').style.display = 'none';
  } else {
    document.getElementById('studentSignupForm').style.display = 'none';
    document.getElementById('teacherSignupForm').style.display = 'block';
  }
}

function checkPasswordStrength(password, strengthId) {
  const strengthDiv = document.getElementById(strengthId);
  
  let strength = 'weak';
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) strength = 'weak';
  else if (score === 3) strength = 'medium';
  else strength = 'strong';
  
  strengthDiv.className = `password-strength ${strength}`;
}

// Add event listeners for password strength
setTimeout(() => {
  const passwordFields = [
    { input: 'studentPassword', strength: 'studentPasswordStrength' },
    { input: 'teacherPassword', strength: 'teacherPasswordStrength' },
    { input: 'newPassword', strength: 'newPasswordStrength' }
  ];
  
  passwordFields.forEach(field => {
    const input = document.getElementById(field.input);
    if (input) {
      input.addEventListener('input', () => checkPasswordStrength(input.value, field.strength));
    }
  });
}, 100);

function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least 1 special character';
  return null;
}

function handleRegistration(event) {
  event.preventDefault();
  
  if (selectedRegRole === 'student') {
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const mobile = document.getElementById('studentMobile').value.trim();
    const enrollment = document.getElementById('studentEnrollment').value.trim();
    const branch = document.getElementById('studentBranch').value;
    const semester = document.getElementById('studentSemester').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;
    
    // Validate mobile format (10 digits only)
    if (!/^[0-9]{10}$/.test(mobile)) {
      showToast('❌ Mobile number must be exactly 10 digits!', 'error');
      return;
    }
    
    // Validate
    if (students.find(s => s.email === email)) {
      showToast('❌ Email already registered!', 'error');
      return;
    }
    
    if (students.find(s => s.mobile === mobile)) {
      showToast('❌ Mobile number already registered!', 'error');
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast('❌ ' + passwordError, 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('❌ Passwords do not match!', 'error');
      return;
    }
    
    // Create student
    const newStudent = {
      id: 'STU' + String(students.length + 1).padStart(3, '0'),
      name,
      email,
      mobile,
      enrollmentNo: enrollment || 'TB-' + Date.now().toString().slice(-6),
      branch,
      semester: parseInt(semester),
      password,
      learnerLevel: 'Average'
    };
    
    students.push(newStudent);
    showToast('✅ Registration successful! Please login to continue.', 'success');
    
    setTimeout(() => {
      closeAuthModal();
      showAuthPage('login');
    }, 1500);
    
  } else {
    // Teacher registration
    const name = document.getElementById('teacherName').value.trim();
    const email = document.getElementById('teacherEmail').value.trim();
    const mobile = document.getElementById('teacherMobile').value.trim();
    const employeeId = document.getElementById('teacherEmployeeId').value.trim();
    const department = document.getElementById('teacherDepartment').value;
    const password = document.getElementById('teacherPassword').value;
    const confirmPassword = document.getElementById('teacherConfirmPassword').value;
    
    // Validate mobile format (10 digits only)
    if (!/^[0-9]{10}$/.test(mobile)) {
      showToast('❌ Mobile number must be exactly 10 digits!', 'error');
      return;
    }
    
    // Validate
    if (teachers.find(t => t.email === email)) {
      showToast('❌ Email already registered!', 'error');
      return;
    }
    
    if (teachers.find(t => t.mobile === mobile)) {
      showToast('❌ Mobile number already registered!', 'error');
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast('❌ ' + passwordError, 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('❌ Passwords do not match!', 'error');
      return;
    }
    
    // Create teacher
    const newTeacher = {
      id: 'TEA' + String(teachers.length + 1).padStart(3, '0'),
      name,
      email,
      mobile,
      employeeId: employeeId || 'EMP' + Date.now().toString().slice(-3),
      department,
      password,
      subjects: [] // Will be assigned later
    };
    
    teachers.push(newTeacher);
    showToast('✅ Teacher registration successful! Please login to continue.', 'success');
    
    setTimeout(() => {
      closeAuthModal();
      showAuthPage('login');
    }, 1500);
  }
}

// Forgot Password
function showForgotPassword() {
  closeAuthModal();
  document.getElementById('forgotPasswordModal').style.display = 'flex';
  document.getElementById('forgotPasswordForm').style.display = 'block';
  document.getElementById('resetPasswordForm').style.display = 'none';
}

function sendResetOTP(event) {
  event.preventDefault();
  
  const emailMobile = document.getElementById('resetEmailMobile').value.trim();
  
  // Find user
  let foundUser = students.find(s => s.email === emailMobile || s.mobile === emailMobile);
  if (!foundUser) {
    foundUser = teachers.find(t => t.email === emailMobile || t.mobile === emailMobile);
  }
  
  if (!foundUser) {
    showToast('❌ User not found!', 'error');
    return;
  }
  
  // Generate OTP
  const otp = generateOTP();
  resetOtpStorage.code = otp;
  resetOtpStorage.userId = foundUser.id;
  resetOtpStorage.expiresAt = Date.now() + (5 * 60 * 1000);
  resetOtpStorage.attempts = 0;
  
  console.log('='.repeat(50));
  console.log('🔐 PASSWORD RESET OTP: ' + otp);
  console.log('📧 User: ' + foundUser.name);
  console.log('='.repeat(50));
  
  // Show step 2
  document.getElementById('forgotPasswordForm').style.display = 'none';
  document.getElementById('resetPasswordForm').style.display = 'block';
  document.getElementById('resetOtpSentMessage').textContent = `✅ Reset OTP sent to ${foundUser.email}. Check console for testing OTP.`;
  
  showToast('Reset OTP sent! Check console.', 'success');
}

function resetPassword(event) {
  event.preventDefault();
  
  const enteredOTP = document.getElementById('resetOtpCode').value.trim();
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  const errorDiv = document.getElementById('resetError');
  
  // Check expiry
  if (Date.now() > resetOtpStorage.expiresAt) {
    errorDiv.textContent = '❌ OTP has expired. Please request a new one.';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Verify OTP
  if (enteredOTP !== resetOtpStorage.code) {
    resetOtpStorage.attempts++;
    errorDiv.textContent = `❌ Invalid OTP. Please try again.`;
    errorDiv.style.display = 'block';
    return;
  }
  
  // Validate password
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    errorDiv.textContent = '❌ ' + passwordError;
    errorDiv.style.display = 'block';
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorDiv.textContent = '❌ Passwords do not match!';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Update password
  let user = students.find(s => s.id === resetOtpStorage.userId);
  if (!user) {
    user = teachers.find(t => t.id === resetOtpStorage.userId);
  }
  
  if (user) {
    user.password = newPassword;
    showToast('✅ Password reset successfully! Please login.', 'success');
    
    setTimeout(() => {
      closeAuthModal();
      showAuthPage('login');
    }, 1500);
    
    // Clear reset storage
    resetOtpStorage = {
      code: null,
      userId: null,
      expiresAt: null,
      attempts: 0
    };
  }
}

function resendResetOTP() {
  const otp = generateOTP();
  resetOtpStorage.code = otp;
  resetOtpStorage.expiresAt = Date.now() + (5 * 60 * 1000);
  resetOtpStorage.attempts = 0;
  
  console.log('='.repeat(50));
  console.log('🔐 NEW RESET OTP: ' + otp);
  console.log('='.repeat(50));
  
  showToast('New reset OTP sent! Check console.', 'success');
  document.getElementById('resetError').style.display = 'none';
}

function backToForgotStep1() {
  document.getElementById('forgotPasswordForm').style.display = 'block';
  document.getElementById('resetPasswordForm').style.display = 'none';
  document.getElementById('resetEmailMobile').value = '';
  document.getElementById('resetOtpCode').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  document.getElementById('resetError').style.display = 'none';
}

function logout() {
  // Show custom logout confirmation modal
  document.getElementById('logoutConfirmModal').style.display = 'flex';
}

function closeLogoutModal() {
  document.getElementById('logoutConfirmModal').style.display = 'none';
}

function confirmLogout() {
  // Close modal
  closeLogoutModal();
  
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

// Student Dashboard
// Check if assignment is visible to student based on learner level
function isAssignmentVisibleToStudent(assignment, studentLearnerLevel) {
  if (!assignment.learnerTypes || assignment.learnerTypes.length === 0) {
    return true; // Show all assignments if no learner types specified
  }
  
  return assignment.learnerTypes.includes(studentLearnerLevel);
}

function showStudentDashboard() {
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('mainHeader').style.display = 'block';
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('studentDashboard').style.display = 'block';
  document.getElementById('assignmentDetails').style.display = 'none';
  document.getElementById('leaderboardPage').style.display = 'none';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  // Setup navigation
  const navTabs = document.getElementById('navTabs');
  navTabs.style.display = 'flex';
  navTabs.innerHTML = `
    <button class="nav-tab active" onclick="showStudentDashboard()">📚 Assignments</button>
    <button class="nav-tab" onclick="showLeaderboard()">🏆 Leaderboard</button>
  `;
  
  // Populate subject filter
  const subjectFilter = document.getElementById('studentSubjectFilter');
  subjectFilter.innerHTML = '<option value="">All Subjects</option>';
  subjects.forEach(subject => {
    subjectFilter.innerHTML += `<option value="${subject.id}">${subject.code} - ${subject.name}</option>`;
  });
  
  renderStudentStats();
  renderStudentLearnerBadge();
  renderStudentAssignments();
  updateNotifications();
}

function renderStudentLearnerBadge() {
  const badge = document.getElementById('studentLearnerBadge');
  const learnerLevel = currentUser.learnerLevel || 'Average';
  
  let icon = '⭐';
  let className = 'average';
  let levelText = 'Average Learner';
  
  if (learnerLevel === 'Advanced') {
    icon = '🏆';
    className = 'advanced';
    levelText = 'Advanced Learner';
  } else if (learnerLevel === 'Slow') {
    icon = '💪';
    className = 'slow';
    levelText = 'Slow Learner';
  }
  
  badge.className = `learner-level-badge ${className}`;
  badge.innerHTML = `
    <span class="icon">${icon}</span>
    <span>Your Level: <strong>${levelText}</strong></span>
  `;
}

function renderStudentStats() {
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const totalAssignments = assignments.length;
  const submittedCount = studentSubmissions.length;
  const pendingCount = totalAssignments - submittedCount;
  
  const gradedSubmissions = studentSubmissions.filter(s => s.marks !== null && s.marks !== undefined);
  const avgMarks = gradedSubmissions.length > 0 
    ? (gradedSubmissions.reduce((sum, s) => sum + s.marks, 0) / gradedSubmissions.length).toFixed(1)
    : 0;
  
  document.getElementById('totalAssignments').textContent = totalAssignments;
  document.getElementById('pendingAssignments').textContent = pendingCount;
  document.getElementById('submittedAssignments').textContent = submittedCount;
  document.getElementById('avgMarks').textContent = avgMarks + '%';
}

function renderStudentAssignments() {
  const container = document.getElementById('assignmentsList');
  const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
  const subjectFilter = document.getElementById('studentSubjectFilter').value;
  const statusFilter = document.getElementById('studentStatusFilter').value;
  const studentLearnerLevel = currentUser.learnerLevel || 'Average';
  
  let filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm) || 
                         assignment.description.toLowerCase().includes(searchTerm);
    const matchesSubject = !subjectFilter || assignment.subjectId === subjectFilter;
    const status = getAssignmentStatus(assignment, currentUser.id);
    const matchesStatus = !statusFilter || status === statusFilter;
    const isVisible = isAssignmentVisibleToStudent(assignment, studentLearnerLevel);
    
    return matchesSearch && matchesSubject && matchesStatus && isVisible;
  });
  
  container.innerHTML = '';
  
  if (filteredAssignments.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No assignments found</p>';
    return;
  }
  
  filteredAssignments.forEach(assignment => {
    const subject = subjects.find(s => s.id === assignment.subjectId);
    const status = getAssignmentStatus(assignment, currentUser.id);
    const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser.id);
    const timeRemaining = getTimeRemaining(assignment.dueDate);
    const urgent = isUrgent(assignment.dueDate);
    
    const card = document.createElement('div');
    card.className = `assignment-card ${status}`;
    card.onclick = () => viewAssignmentDetails(assignment.id);
    
    let statusBadge = '';
    if (status === 'upcoming') statusBadge = '<span class="status-badge status-upcoming">Upcoming</span>';
    else if (status === 'ongoing') statusBadge = '<span class="status-badge status-ongoing">Ongoing</span>';
    else if (status === 'submitted') statusBadge = '<span class="status-badge status-submitted">Submitted</span>';
    else if (status === 'graded') statusBadge = '<span class="status-badge status-graded">Graded</span>';
    
    if (submission && submission.isLate) {
      statusBadge += ' <span class="status-badge status-late">LATE</span>';
    }
    
    // Generate learner type badges
    let learnerTypesHTML = '';
    if (assignment.learnerTypes && assignment.learnerTypes.length > 0) {
      learnerTypesHTML = '<div class="assignment-learner-types">';
      assignment.learnerTypes.forEach(type => {
        let icon = '⭐';
        let className = 'average';
        if (type === 'Advanced') {
          icon = '🏆';
          className = 'advanced';
        } else if (type === 'Slow') {
          icon = '💪';
          className = 'slow';
        }
        learnerTypesHTML += `<span class="learner-type-tag ${className}">${icon} ${type}</span>`;
      });
      learnerTypesHTML += '</div>';
    }
    
    card.innerHTML = `
      <div class="assignment-header">
        <div>
          <h3 class="assignment-title">${assignment.title}</h3>
          <p class="assignment-subject">${subject.code} - ${subject.name}</p>
          ${learnerTypesHTML}
        </div>
        <div>${statusBadge}</div>
      </div>
      <div class="assignment-meta">
        <div class="meta-item">📅 Due: ${formatDate(assignment.dueDate)}</div>
        <div class="meta-item">📊 Marks: ${assignment.totalMarks}</div>
        <div class="meta-item">
          ⏰ <span class="countdown-timer ${urgent ? 'timer-urgent' : ''}">${timeRemaining}</span>
        </div>
        ${submission && submission.marks !== null ? `<div class="meta-item">✅ Score: ${submission.marks}/${assignment.totalMarks}</div>` : ''}
      </div>
    `;
    
    container.appendChild(card);
  });
}

function filterStudentAssignments() {
  renderStudentAssignments();
}

// Assignment Details
function viewAssignmentDetails(assignmentId) {
  selectedAssignmentId = assignmentId;
  const assignment = assignments.find(a => a.id === assignmentId);
  const subject = subjects.find(s => s.id === assignment.subjectId);
  const status = getAssignmentStatus(assignment, currentUser.id);
  const submission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
  
  document.getElementById('studentDashboard').style.display = 'none';
  document.getElementById('assignmentDetails').style.display = 'block';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  document.getElementById('detailTitle').textContent = assignment.title;
  document.getElementById('detailSubject').textContent = `${subject.code} - ${subject.name}`;
  document.getElementById('detailDueDate').textContent = formatDate(assignment.dueDate);
  document.getElementById('detailMarks').textContent = assignment.totalMarks;
  document.getElementById('detailDescription').textContent = assignment.description;
  
  let statusBadge = '';
  if (status === 'upcoming') statusBadge = '<span class="status-badge status-upcoming">Upcoming</span>';
  else if (status === 'ongoing') statusBadge = '<span class="status-badge status-ongoing">Ongoing</span>';
  else if (status === 'submitted') statusBadge = '<span class="status-badge status-submitted">Submitted</span>';
  else if (status === 'graded') statusBadge = '<span class="status-badge status-graded">Graded</span>';
  document.getElementById('detailStatus').innerHTML = statusBadge;
  
  // Timer
  updateTimer(assignment.dueDate);
  
  // Show/hide submission form
  const submissionCard = document.getElementById('submissionCard');
  const now = new Date();
  if (now < new Date(assignment.dueDate)) {
    submissionCard.style.display = 'block';
  } else {
    submissionCard.style.display = 'none';
  }
  
  // Version history
  if (submission) {
    const versionCard = document.getElementById('versionHistoryCard');
    versionCard.style.display = 'block';
    renderVersionHistory(assignmentId);
  } else {
    document.getElementById('versionHistoryCard').style.display = 'none';
  }
  
  // Feedback
  if (submission && submission.marks !== null) {
    const feedbackCard = document.getElementById('feedbackCard');
    feedbackCard.style.display = 'block';
    const totalMarks = assignment.totalMarks;
    document.getElementById('obtainedMarks').textContent = `${submission.marks}/${totalMarks} (${((submission.marks/totalMarks)*100).toFixed(1)}%)`;
    document.getElementById('feedbackText').textContent = submission.feedback || 'No feedback provided.';
  } else {
    document.getElementById('feedbackCard').style.display = 'none';
  }
  
  // Load comments
  renderComments(assignmentId);
}

function updateTimer(dueDate) {
  const timerElement = document.getElementById('detailTimer');
  
  function update() {
    const timeRemaining = getTimeRemaining(dueDate);
    const urgent = isUrgent(dueDate);
    timerElement.textContent = timeRemaining;
    timerElement.className = `countdown-timer ${urgent ? 'timer-urgent' : ''}`;
  }
  
  update();
  const interval = setInterval(update, 60000); // Update every minute
  currentTimers.push(interval);
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('filePreview').innerHTML = `
      <strong>Selected File:</strong> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
    `;
  }
}

function submitAssignment(event) {
  event.preventDefault();
  
  const fileInput = document.getElementById('fileUpload');
  const comments = document.getElementById('submissionComments').value;
  
  if (!fileInput.files[0]) {
    showToast('Please select a file to upload', 'error');
    return;
  }
  
  const file = fileInput.files[0];
  const assignment = assignments.find(a => a.id === selectedAssignmentId);
  const now = new Date();
  const isLate = now > new Date(assignment.dueDate);
  
  // Check for existing submission
  const existingSubmission = submissions.find(s => 
    s.assignmentId === selectedAssignmentId && s.studentId === currentUser.id
  );
  
  if (existingSubmission) {
    // Update version
    existingSubmission.version += 1;
    existingSubmission.submittedAt = now;
    existingSubmission.fileName = file.name;
    existingSubmission.fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    existingSubmission.comments = comments;
    existingSubmission.isLate = isLate;
    showToast('Assignment resubmitted successfully! (Version ' + existingSubmission.version + ')', 'success');
  } else {
    // New submission
    const newSubmission = {
      id: 'SUB' + String(submissions.length + 1).padStart(3, '0'),
      assignmentId: selectedAssignmentId,
      studentId: currentUser.id,
      submittedAt: now,
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      comments,
      version: 1,
      isLate,
      marks: null,
      feedback: null,
      evaluatedAt: null
    };
    
    submissions.push(newSubmission);
    showToast('Assignment submitted successfully!', 'success');
  }
  
  // Add notification
  const teacher = teachers.find(t => t.id === assignment.createdBy);
  notifications.push({
    id: 'NOT' + String(notifications.length + 1).padStart(3, '0'),
    userId: teacher.id,
    message: `${currentUser.name} submitted "${assignment.title}"`,
    timestamp: now,
    isRead: false,
    type: 'submission'
  });
  
  // Reset form
  document.getElementById('submissionForm').reset();
  document.getElementById('filePreview').innerHTML = '';
  
  // Refresh view
  setTimeout(() => viewAssignmentDetails(selectedAssignmentId), 1000);
}

function renderVersionHistory(assignmentId) {
  const submission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
  const container = document.getElementById('versionHistory');
  
  if (!submission) {
    container.innerHTML = '<p>No submissions yet</p>';
    return;
  }
  
  let html = '';
  for (let i = submission.version; i >= 1; i--) {
    html += `
      <div class="version-item">
        <div class="version-info">
          <div class="version-number">Version ${i}</div>
          <div>${formatDate(submission.submittedAt)}</div>
          <div>${submission.fileName}</div>
        </div>
        <button class="btn btn-secondary btn-small" onclick="showToast('Download feature simulated', 'info')">📥 Download</button>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function renderComments(assignmentId) {
  const assignmentComments = comments.filter(c => c.assignmentId === assignmentId);
  const container = document.getElementById('commentsList');
  
  if (assignmentComments.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No comments yet. Be the first to ask!</p>';
    return;
  }
  
  container.innerHTML = '';
  assignmentComments.forEach(comment => {
    const user = comment.userType === 'student' 
      ? students.find(s => s.id === comment.userId)
      : teachers.find(t => t.id === comment.userId);
    
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
      <div class="comment-author">${user.name} ${comment.userType === 'teacher' ? '(Teacher)' : ''}</div>
      <div class="comment-text">${comment.text}</div>
      <div class="comment-time">${formatDate(comment.timestamp)}</div>
    `;
    container.appendChild(div);
  });
}

function postComment(event) {
  event.preventDefault();
  
  const text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  
  const newComment = {
    id: 'COM' + String(comments.length + 1).padStart(3, '0'),
    assignmentId: selectedAssignmentId,
    userId: currentUser.id,
    userType: currentRole,
    text,
    timestamp: new Date()
  };
  
  comments.push(newComment);
  document.getElementById('commentInput').value = '';
  renderComments(selectedAssignmentId);
  showToast('Comment posted successfully', 'success');
}

function goBackToDashboard() {
  // Clear timers
  currentTimers.forEach(timer => clearInterval(timer));
  currentTimers = [];
  
  document.getElementById('assignmentDetails').style.display = 'none';
  showStudentDashboard();
}

// Teacher Dashboard
function showTeacherDashboard() {
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('mainHeader').style.display = 'block';
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('teacherDashboard').style.display = 'block';
  document.getElementById('createAssignmentPage').style.display = 'none';
  document.getElementById('evaluatePage').style.display = 'none';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  // Setup navigation
  const navTabs = document.getElementById('navTabs');
  navTabs.style.display = 'flex';
  navTabs.innerHTML = `
    <button class="nav-tab active" onclick="showTeacherDashboard()">📚 My Assignments</button>
    <button class="nav-tab" onclick="showNotificationModal()">📢 Send Notification</button>
  `;
  
  renderTeacherStats();
  renderTeacherAssignments();
  renderSubmissionChart();
  updateNotifications();
}

function renderTeacherStats() {
  const teacherAssignments = assignments.filter(a => a.createdBy === currentUser.id);
  const totalAssignments = teacherAssignments.length;
  
  const allSubmissions = submissions.filter(s => 
    teacherAssignments.some(a => a.id === s.assignmentId)
  );
  
  const pendingEval = allSubmissions.filter(s => s.marks === null).length;
  const lateSubmissions = allSubmissions.filter(s => s.isLate).length;
  const evaluated = allSubmissions.filter(s => s.marks !== null).length;
  
  document.getElementById('teacherTotalAssignments').textContent = totalAssignments;
  document.getElementById('teacherPendingEval').textContent = pendingEval;
  document.getElementById('teacherLateSubmissions').textContent = lateSubmissions;
  document.getElementById('teacherEvaluated').textContent = evaluated;
}

function renderTeacherAssignments() {
  const container = document.getElementById('teacherAssignmentsList');
  const teacherAssignments = assignments.filter(a => a.createdBy === currentUser.id);
  
  container.innerHTML = '';
  
  if (teacherAssignments.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No assignments created yet. Click "Create Assignment" to get started.</p>';
    return;
  }
  
  teacherAssignments.forEach(assignment => {
    const subject = subjects.find(s => s.id === assignment.subjectId);
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
    const totalStudents = students.length;
    const submittedCount = assignmentSubmissions.length;
    const pendingCount = totalStudents - submittedCount;
    const lateCount = assignmentSubmissions.filter(s => s.isLate).length;
    
    const card = document.createElement('div');
    card.className = 'assignment-card';
    card.onclick = () => viewSubmissions(assignment.id);
    
    card.innerHTML = `
      <div class="assignment-header">
        <div>
          <h3 class="assignment-title">${assignment.title}</h3>
          <p class="assignment-subject">${subject.code} - ${subject.name}</p>
        </div>
        <span class="status-badge status-ongoing">Active</span>
      </div>
      <div class="assignment-meta">
        <div class="meta-item">📅 Due: ${formatDate(assignment.dueDate)}</div>
        <div class="meta-item">📊 Marks: ${assignment.totalMarks}</div>
        <div class="meta-item">✅ Submitted: ${submittedCount}/${totalStudents}</div>
        <div class="meta-item">⏳ Pending: ${pendingCount}</div>
        ${lateCount > 0 ? `<div class="meta-item">⚠️ Late: ${lateCount}</div>` : ''}
      </div>
    `;
    
    container.appendChild(card);
  });
}

function renderSubmissionChart() {
  const ctx = document.getElementById('submissionChart');
  if (!ctx) return;
  
  const teacherAssignments = assignments.filter(a => a.createdBy === currentUser.id);
  const labels = teacherAssignments.map(a => a.title.substring(0, 20) + '...');
  const totalStudents = students.length;
  
  const submittedData = teacherAssignments.map(a => {
    return submissions.filter(s => s.assignmentId === a.id).length;
  });
  
  const pendingData = teacherAssignments.map(a => {
    const submitted = submissions.filter(s => s.assignmentId === a.id).length;
    return totalStudents - submitted;
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Submitted',
          data: submittedData,
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Pending',
          data: pendingData,
          backgroundColor: '#FF9800'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Submission Statistics'
        }
      }
    }
  });
}

function showCreateAssignment() {
  document.getElementById('teacherDashboard').style.display = 'none';
  document.getElementById('createAssignmentPage').style.display = 'block';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  // Populate subject dropdown
  const subjectSelect = document.getElementById('assignmentSubject');
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  
  currentUser.subjects.forEach(subjectId => {
    const subject = subjects.find(s => s.id === subjectId);
    subjectSelect.innerHTML += `<option value="${subject.id}">${subject.code} - ${subject.name}</option>`;
  });
}

function createAssignment(event) {
  event.preventDefault();
  
  const title = document.getElementById('assignmentTitle').value.trim();
  const subjectId = document.getElementById('assignmentSubject').value;
  const dueDate = new Date(document.getElementById('assignmentDueDate').value);
  const totalMarks = parseInt(document.getElementById('assignmentMarks').value);
  const description = document.getElementById('assignmentDescription').value.trim();
  
  // Get selected learner types
  const learnerTypeCheckboxes = document.querySelectorAll('input[name="learnerTypes"]:checked');
  const learnerTypes = Array.from(learnerTypeCheckboxes).map(cb => cb.value);
  
  if (learnerTypes.length === 0) {
    showToast('Please select at least one learner type', 'error');
    return;
  }
  
  // Determine difficulty based on learner types
  let difficulty = 'Medium';
  if (learnerTypes.includes('Advanced') && !learnerTypes.includes('Average') && !learnerTypes.includes('Slow')) {
    difficulty = 'Hard';
  } else if (learnerTypes.includes('Slow') && !learnerTypes.includes('Average') && !learnerTypes.includes('Advanced')) {
    difficulty = 'Easy';
  }
  
  const newAssignment = {
    id: 'ASSGN' + String(assignments.length + 1).padStart(3, '0'),
    title,
    description,
    subjectId,
    dueDate,
    totalMarks,
    createdBy: currentUser.id,
    createdAt: new Date(),
    learnerTypes: learnerTypes,
    difficulty: difficulty
  };
  
  assignments.push(newAssignment);
  
  // Notify only students with matching learner levels
  students.forEach(student => {
    if (learnerTypes.includes(student.learnerLevel)) {
      notifications.push({
        id: 'NOT' + String(notifications.length + 1).padStart(3, '0'),
        userId: student.id,
        message: `New assignment posted for ${student.learnerLevel} learners: "${title}"`,
        timestamp: new Date(),
        isRead: false,
        type: 'new_assignment'
      });
    }
  });
  
  showToast('Assignment created and students notified!', 'success');
  document.getElementById('createAssignmentForm').reset();
  
  setTimeout(() => goBackToTeacherDashboard(), 1000);
}

function goBackToTeacherDashboard() {
  document.getElementById('createAssignmentPage').style.display = 'none';
  document.getElementById('evaluatePage').style.display = 'none';
  showTeacherDashboard();
}

function viewSubmissions(assignmentId) {
  selectedAssignmentId = assignmentId;
  const assignment = assignments.find(a => a.id === assignmentId);
  
  document.getElementById('teacherDashboard').style.display = 'none';
  document.getElementById('evaluatePage').style.display = 'block';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  document.getElementById('evaluateTitle').textContent = assignment.title;
  
  renderSubmissionsList();
}

function renderSubmissionsList() {
  const container = document.getElementById('submissionsList');
  const filter = document.getElementById('evaluateFilter').value;
  const assignment = assignments.find(a => a.id === selectedAssignmentId);
  
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === selectedAssignmentId);
  
  let displaySubmissions = [];
  
  if (filter === 'all' || filter === 'submitted' || filter === 'late' || filter === 'evaluated') {
    displaySubmissions = assignmentSubmissions.filter(s => {
      if (filter === 'late') return s.isLate;
      if (filter === 'evaluated') return s.marks !== null;
      return true;
    });
  }
  
  if (filter === 'missing') {
    const submittedStudentIds = assignmentSubmissions.map(s => s.studentId);
    const missingStudents = students.filter(st => !submittedStudentIds.includes(st.id));
    
    container.innerHTML = `
      <div class="submission-row header">
        <div>Student Name</div>
        <div>Enrollment No</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
    `;
    
    missingStudents.forEach(student => {
      const row = document.createElement('div');
      row.className = 'submission-row';
      row.innerHTML = `
        <div>${student.name}</div>
        <div>${student.enrollmentNo}</div>
        <div><span class="status-badge status-upcoming">Not Submitted</span></div>
        <div>-</div>
      `;
      container.appendChild(row);
    });
    return;
  }
  
  container.innerHTML = `
    <div class="submission-row header">
      <div>Student Name</div>
      <div>Submitted At</div>
      <div>Status</div>
      <div>Score</div>
      <div>Actions</div>
    </div>
  `;
  
  if (displaySubmissions.length === 0) {
    container.innerHTML += '<p style="text-align: center; padding: 40px; color: var(--color-text-secondary);">No submissions found</p>';
    return;
  }
  
  displaySubmissions.forEach(submission => {
    const student = students.find(s => s.id === submission.studentId);
    const row = document.createElement('div');
    row.className = 'submission-row';
    
    let statusBadge = '<span class="status-badge status-submitted">Submitted</span>';
    if (submission.isLate) statusBadge += ' <span class="status-badge status-late">LATE</span>';
    if (submission.marks !== null) statusBadge = '<span class="status-badge status-graded">Graded</span>';
    
    const scoreDisplay = submission.marks !== null 
      ? `${submission.marks}/${assignment.totalMarks}`
      : 'Not graded';
    
    row.innerHTML = `
      <div>${student.name}</div>
      <div>${formatDate(submission.submittedAt)}</div>
      <div>${statusBadge}</div>
      <div>${scoreDisplay}</div>
      <div class="submission-actions">
        <button class="btn btn-secondary btn-small" onclick="showToast('Download feature simulated', 'info')">📥</button>
        <button class="btn btn-primary btn-small" onclick='openGradeModal("${submission.id}")'>Grade</button>
      </div>
    `;
    
    container.appendChild(row);
  });
}

function filterSubmissions() {
  renderSubmissionsList();
}

function downloadAllSubmissions() {
  showToast('Batch download feature simulated. All submissions would be downloaded as ZIP.', 'info');
}

function openGradeModal(submissionId) {
  selectedSubmissionData = submissions.find(s => s.id === submissionId);
  const student = students.find(s => s.id === selectedSubmissionData.studentId);
  const assignment = assignments.find(a => a.id === selectedSubmissionData.assignmentId);
  
  document.getElementById('gradeModal').style.display = 'flex';
  document.getElementById('gradeStudentName').value = student.name;
  document.getElementById('gradeTotalMarks').textContent = assignment.totalMarks;
  document.getElementById('gradeMarks').max = assignment.totalMarks;
  
  if (selectedSubmissionData.marks !== null) {
    document.getElementById('gradeMarks').value = selectedSubmissionData.marks;
    document.getElementById('gradeFeedback').value = selectedSubmissionData.feedback || '';
  } else {
    document.getElementById('gradeMarks').value = '';
    document.getElementById('gradeFeedback').value = '';
  }
}

function closeGradeModal() {
  document.getElementById('gradeModal').style.display = 'none';
  selectedSubmissionData = null;
}

function submitGrade(event) {
  event.preventDefault();
  
  const marks = parseInt(document.getElementById('gradeMarks').value);
  const feedback = document.getElementById('gradeFeedback').value.trim();
  
  selectedSubmissionData.marks = marks;
  selectedSubmissionData.feedback = feedback;
  selectedSubmissionData.evaluatedAt = new Date();
  
  // Notify student
  const assignment = assignments.find(a => a.id === selectedSubmissionData.assignmentId);
  notifications.push({
    id: 'NOT' + String(notifications.length + 1).padStart(3, '0'),
    userId: selectedSubmissionData.studentId,
    message: `Your submission for "${assignment.title}" has been graded. Score: ${marks}/${assignment.totalMarks}`,
    timestamp: new Date(),
    isRead: false,
    type: 'graded'
  });
  
  showToast('Grade submitted successfully!', 'success');
  closeGradeModal();
  renderSubmissionsList();
  renderTeacherStats();
}

// Leaderboard
function showLeaderboard() {
  document.getElementById('studentDashboard').style.display = 'none';
  document.getElementById('assignmentDetails').style.display = 'none';
  document.getElementById('leaderboardPage').style.display = 'block';
  document.getElementById('dashboardFooter').style.display = 'block';
  
  // Update nav
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[1].classList.add('active');
  
  renderLeaderboard();
  renderPerformanceChart();
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboardList');
  
  // Calculate student scores
  const studentScores = students.map(student => {
    const studentSubmissions = submissions.filter(s => 
      s.studentId === student.id && s.marks !== null
    );
    
    const totalMarks = studentSubmissions.reduce((sum, s) => {
      const assignment = assignments.find(a => a.id === s.assignmentId);
      return sum + assignment.totalMarks;
    }, 0);
    
    const obtainedMarks = studentSubmissions.reduce((sum, s) => sum + s.marks, 0);
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    
    return {
      ...student,
      percentage: percentage.toFixed(2),
      submissionCount: studentSubmissions.length
    };
  });
  
  // Sort by percentage
  studentScores.sort((a, b) => b.percentage - a.percentage);
  
  container.innerHTML = '';
  
  studentScores.forEach((student, index) => {
    const div = document.createElement('div');
    div.className = 'leaderboard-item';
    
    let rankClass = '';
    if (index === 0) rankClass = 'top1';
    else if (index === 1) rankClass = 'top2';
    else if (index === 2) rankClass = 'top3';
    
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    
    div.innerHTML = `
      <div class="rank ${rankClass}">${medal || (index + 1)}</div>
      <div class="student-info">
        <div class="student-name">${student.name}</div>
        <div class="student-enrollment">${student.enrollmentNo}</div>
      </div>
      <div class="score">${student.percentage}%</div>
    `;
    
    container.appendChild(div);
  });
  
  // Show current student performance
  const currentStudentData = studentScores.find(s => s.id === currentUser.id);
  const performanceContainer = document.getElementById('studentPerformance');
  
  if (currentStudentData) {
    const rank = studentScores.findIndex(s => s.id === currentUser.id) + 1;
    performanceContainer.innerHTML = `
      <div class="performance-item">
        <span class="performance-label">Your Rank</span>
        <span class="performance-value">#${rank}</span>
      </div>
      <div class="performance-item">
        <span class="performance-label">Your Score</span>
        <span class="performance-value">${currentStudentData.percentage}%</span>
      </div>
      <div class="performance-item">
        <span class="performance-label">Submissions</span>
        <span class="performance-value">${currentStudentData.submissionCount}</span>
      </div>
    `;
  }
}

function renderPerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;
  
  // Calculate subject-wise average
  const subjectAverages = subjects.map(subject => {
    const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
    const subjectSubmissions = submissions.filter(s => 
      subjectAssignments.some(a => a.id === s.assignmentId) && 
      s.studentId === currentUser.id &&
      s.marks !== null
    );
    
    if (subjectSubmissions.length === 0) return 0;
    
    const totalMarks = subjectSubmissions.reduce((sum, s) => {
      const assignment = assignments.find(a => a.id === s.assignmentId);
      return sum + assignment.totalMarks;
    }, 0);
    
    const obtainedMarks = subjectSubmissions.reduce((sum, s) => sum + s.marks, 0);
    return totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  });
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: subjects.map(s => s.code),
      datasets: [{
        label: 'Your Performance',
        data: subjectAverages,
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        borderColor: '#FF9800',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Notifications
function updateNotifications() {
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;
  
  document.getElementById('notificationBadge').textContent = unreadCount;
  document.getElementById('notificationBadge').style.display = unreadCount > 0 ? 'block' : 'none';
}

function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  const isVisible = panel.style.display === 'block';
  
  if (isVisible) {
    panel.style.display = 'none';
  } else {
    panel.style.display = 'block';
    renderNotifications();
  }
}

function renderNotifications() {
  const container = document.getElementById('notificationList');
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  
  if (userNotifications.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--color-text-secondary);">No notifications</p>';
    return;
  }
  
  // Sort by timestamp (newest first)
  userNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  container.innerHTML = '';
  userNotifications.forEach(notification => {
    const div = document.createElement('div');
    div.className = `notification-item ${!notification.isRead ? 'unread' : ''}`;
    div.onclick = () => markAsRead(notification.id);
    
    div.innerHTML = `
      <div>${notification.message}</div>
      <div class="notification-time">${formatDate(notification.timestamp)}</div>
    `;
    
    container.appendChild(div);
  });
}

function markAsRead(notificationId) {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
    updateNotifications();
    renderNotifications();
  }
}

// Auto-reminders (simulate)
function checkDeadlineReminders() {
  const now = new Date();
  
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    
    // Remind 24 hours before
    if (hoursUntilDue > 23 && hoursUntilDue < 25) {
      students.forEach(student => {
        const hasSubmitted = submissions.some(s => 
          s.assignmentId === assignment.id && s.studentId === student.id
        );
        
        if (!hasSubmitted) {
          const existingReminder = notifications.find(n => 
            n.userId === student.id && 
            n.message.includes(assignment.title) &&
            n.type === 'reminder'
          );
          
          if (!existingReminder) {
            notifications.push({
              id: 'NOT' + String(notifications.length + 1).padStart(3, '0'),
              userId: student.id,
              message: `⏰ Reminder: Assignment "${assignment.title}" is due in 24 hours!`,
              timestamp: new Date(),
              isRead: false,
              type: 'reminder'
            });
          }
        }
      });
    }
  });
}

// Notification Modal Functions
function showNotificationModal() {
  document.getElementById('notificationModal').style.display = 'flex';
  
  // Populate subject dropdown
  const subjectSelect = document.getElementById('notificationSubject');
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  
  currentUser.subjects.forEach(subjectId => {
    const subject = subjects.find(s => s.id === subjectId);
    subjectSelect.innerHTML += `<option value="${subject.id}">${subject.code} - ${subject.name}</option>`;
  });
}

function closeNotificationModal() {
  document.getElementById('notificationModal').style.display = 'none';
  document.getElementById('notificationForm').reset();
  document.getElementById('studentSelectionGroup').style.display = 'none';
  document.getElementById('schedulePickerGroup').style.display = 'none';
}

function loadNotificationAssignments() {
  const subjectId = document.getElementById('notificationSubject').value;
  const assignmentSelect = document.getElementById('notificationAssignment');
  
  assignmentSelect.innerHTML = '<option value="all">All Assignments in Subject</option>';
  
  if (subjectId) {
    const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
    subjectAssignments.forEach(assignment => {
      assignmentSelect.innerHTML += `<option value="${assignment.id}">${assignment.title}</option>`;
    });
  }
}

function toggleStudentSelection() {
  const recipientType = document.querySelector('input[name="recipients"]:checked').value;
  const studentSelectionGroup = document.getElementById('studentSelectionGroup');
  
  if (recipientType === 'specific') {
    studentSelectionGroup.style.display = 'block';
    
    // Populate student checkboxes
    const container = document.getElementById('studentCheckboxes');
    container.innerHTML = '';
    
    students.forEach(student => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `
        <input type="checkbox" name="students" value="${student.id}">
        <span>${student.name}</span>
      `;
      container.appendChild(label);
    });
  } else {
    studentSelectionGroup.style.display = 'none';
  }
}

function toggleSchedulePicker() {
  const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
  const schedulePickerGroup = document.getElementById('schedulePickerGroup');
  
  if (scheduleType === 'later') {
    schedulePickerGroup.style.display = 'block';
    
    // Set minimum date to now
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('scheduleDateTime').min = minDateTime;
  } else {
    schedulePickerGroup.style.display = 'none';
  }
}

function sendNotification(event) {
  event.preventDefault();
  
  const notificationType = document.getElementById('notificationType').value;
  const subjectId = document.getElementById('notificationSubject').value;
  const assignmentId = document.getElementById('notificationAssignment').value;
  const recipientType = document.querySelector('input[name="recipients"]:checked').value;
  const title = document.getElementById('notificationTitle').value.trim();
  const content = document.getElementById('notificationContent').value.trim();
  const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
  
  // Get recipients
  let recipients = [];
  if (recipientType === 'all') {
    recipients = students.map(s => s.id);
  } else {
    const checkedBoxes = document.querySelectorAll('input[name="students"]:checked');
    recipients = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (recipients.length === 0) {
      showToast('Please select at least one student', 'error');
      return;
    }
  }
  
  // Get assignment details if specific assignment selected
  let assignmentInfo = '';
  if (assignmentId !== 'all') {
    const assignment = assignments.find(a => a.id === assignmentId);
    assignmentInfo = ` - ${assignment.title}`;
  }
  
  // Get subject info
  const subject = subjects.find(s => s.id === subjectId);
  
  // Create notification icon based on type
  let icon = '📢';
  if (notificationType === 'new_assignment') icon = '📝';
  else if (notificationType === 'deadline_reminder') icon = '⏰';
  else if (notificationType === 'deadline_extension') icon = '🎉';
  else if (notificationType === 'late_warning') icon = '⚠️';
  
  // Create full message
  const fullMessage = `${icon} ${title}\n${content}\n\n[${subject.code}${assignmentInfo}]`;
  
  // Send notifications
  const timestamp = scheduleType === 'now' ? new Date() : new Date(document.getElementById('scheduleDateTime').value);
  
  recipients.forEach(studentId => {
    notifications.push({
      id: 'NOT' + String(notifications.length + 1).padStart(3, '0'),
      userId: studentId,
      message: fullMessage,
      timestamp: timestamp,
      isRead: false,
      type: notificationType
    });
  });
  
  // Show success message
  const scheduleInfo = scheduleType === 'later' ? ` (scheduled for ${formatDate(timestamp)})` : '';
  showToast(`✅ Notification sent to ${recipients.length} student(s)${scheduleInfo}!`, 'success');
  
  // Close modal
  closeNotificationModal();
  
  // Update notification counts if any students are logged in
  updateNotifications();
}

// Initialize
setInterval(checkDeadlineReminders, 3600000); // Check every hour
checkDeadlineReminders(); // Initial check