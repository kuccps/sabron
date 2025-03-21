const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
    resave: false,
      saveUninitialized: true
      }));

// Initialize SQLite database
const db = new sqlite3.Database('./submissions.db');

// Ensure the 'submissions' table with 'timestamp' exists
db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY,
        fullName TEXT,
        phone TEXT,
        email TEXT,
        description TEXT,
        birthCertificate TEXT,
        resultSlip TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.run(`CREATE TABLE IF NOT EXISTS blocked_users (email TEXT UNIQUE)`);

// Cache Blocked Users
const blockedUsers = new Set();
db.all('SELECT email FROM blocked_users', (err, rows) => {
    if (!err) rows.forEach(row => blockedUsers.add(row.email));
});

// File Upload Configuration (Preserve Extension)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Keep original extension
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); // e.g., birthCertificate-12345.pdf
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
        allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type.'));
    }
});

// Admin Authentication Middleware
function requireAdminAuth(req, res, next) {
    if (!req.session.isAdmin) return res.status(401).send('Unauthorized');
    next();
}

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'service.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin-login.html')));
app.get('/admin/dashboard', requireAdminAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'sabron' && password === 'sabronwamudha1') {
        req.session.isAdmin = true;
        return res.sendStatus(200);
    }
    res.status(401).send('Invalid credentials');
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin'));
});

// Form Submission (with Block Check)
app.post('/submit', upload.fields([{ name: 'birthCertificate' }, { name: 'resultSlip' }]), (req, res) => {
    const { fullName, phone, email, description } = req.body;

    if (!req.files['birthCertificate'] || !req.files['resultSlip']) {
        return res.status(400).json({ error: 'Missing required files' });
    }

    const birthCertificate = req.files['birthCertificate'][0].filename;
    const resultSlip = req.files['resultSlip'][0].filename;

    if (blockedUsers.has(email)) return res.status(403).json({ error: 'Access Denied. You are blocked.' });

    db.run(`INSERT INTO submissions (fullName, phone, email, description, birthCertificate, resultSlip) 
            VALUES (?, ?, ?, ?, ?, ?)`,
        [fullName, phone, email, description, birthCertificate, resultSlip],
        (err) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.redirect('/success.html');
        });
});

// Fetch All Submissions (Admin Only)
app.get('/api/admin/submissions', requireAdminAuth, (req, res) => {
    console.log('Fetching submissions...');
    db.all('SELECT * FROM submissions ORDER BY timestamp DESC', (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Error fetching submissions' });
        }
        console.log('Fetched Rows:', rows);
        res.json(rows);
    });
});


// Clear All Submissions
app.delete('/api/admin/clear-submissions', requireAdminAuth, (req, res) => {
    db.run('DELETE FROM submissions', (err) => {
        if (err) return res.status(500).send('Error clearing submissions');
        res.sendStatus(200);
    });
});

// Block User
app.post('/api/admin/block-user', requireAdminAuth, (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email is required.');

    db.run('INSERT OR IGNORE INTO blocked_users (email) VALUES (?)', [email], (err) => {
        if (err) return res.status(500).send('Error blocking user');
        blockedUsers.add(email);
        console.log(`User blocked: ${email}`);
        res.sendStatus(200);
    });
});

// Unblock User
app.post('/api/admin/unblock-user', requireAdminAuth, (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email is required.');

    db.run('DELETE FROM blocked_users WHERE email = ?', [email], (err) => {
        if (err) return res.status(500).send('Error unblocking user');
        blockedUsers.delete(email);
        console.log(`User unblocked: ${email}`);
        res.sendStatus(200);
    });
});

// Improved Download Route
app.get('/api/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    db.get('SELECT birthCertificate, resultSlip FROM submissions WHERE birthCertificate = ? OR resultSlip = ?', [filename, filename], (err, row) => {
        if (err || !row) return res.status(404).send('File not found.');

        // Use original uploaded filename
        const originalFilename = row.birthCertificate === filename ? 'birth_certificate.pdf' : 'result_slip.pdf';

        res.download(filePath, originalFilename, (downloadErr) => {
            if (downloadErr) res.status(500).send('Error downloading file.');
        });
    });
});

// Start Server
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
