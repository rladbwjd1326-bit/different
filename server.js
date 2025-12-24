require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

// Ollama URL
const OLLAMA_API = 'http://127.0.0.1:11434/api/generate';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));
app.use('/images/travel', express.static(path.join(__dirname, 'images', 'travel')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// --- Database Connection ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- Init DB ---
async function initDB() {
    try {
        // Init connection to create DB if needed
        const tempPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await tempPool.end();

        // Now Init Tables
        const connection = await pool.getConnection();

        // Check/Create Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nickname VARCHAR(100),
                profile_image VARCHAR(255),
                points INT DEFAULT 0,
                last_point_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure columns exist (for existing tables)
        const [userCols] = await connection.query("SHOW COLUMNS FROM users");
        const colNames = userCols.map(c => c.Field);

        if (!colNames.includes('profile_image')) {
            await connection.query("ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) AFTER nickname");
        }
        if (!colNames.includes('points')) {
            await connection.query("ALTER TABLE users ADD COLUMN points INT DEFAULT 0 AFTER profile_image");
        }
        if (!colNames.includes('last_point_at')) {
            await connection.query("ALTER TABLE users ADD COLUMN last_point_at DATETIME AFTER points");
        }


        // Create Bookmarks Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS bookmarks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                place_id INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_place (user_id, place_id)
            )
        `);

        // Create Places Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS places (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                content TEXT,
                image VARCHAR(255),
                category_id INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);


        connection.release();
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}

initDB();

// --- Places Route ---
app.get('/api/places', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 60;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const tag = req.query.tag || '';
        const category = req.query.category || '';

        let query = 'SELECT * FROM places WHERE 1=1';
        let params = [];

        if (search) {
            query += ' AND (name LIKE ? OR address LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category && category !== '') {
            query += ' AND category_id = ?';
            params.push(parseInt(category));
        }

        if (tag && tag !== '') {
            query += ' AND address LIKE ?';
            params.push(`%${tag}%`);
        }

        query += ' ORDER BY id DESC';

        // Count logic
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countRows] = await pool.query(countQuery, params);
        const total = countRows[0].total;

        // Fetch logic
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await pool.query(query, params);

        res.json({
            spots: rows,
            total: total
        });

    } catch (error) {
        console.error('Places API Error:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

app.get('/api/places/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM places WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Place not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching place' });
    }
});


app.get('/api/bookmarks', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: '사용자 ID가 필요합니다.' });
    }

    try {
        const [rows] = await pool.query('SELECT place_id FROM bookmarks WHERE user_id = ?', [userId]);
        res.json(rows.map(row => row.place_id));
    } catch (error) {
        res.status(500).json({ error: '북마크 목록을 불러오는데 실패했습니다.' });
    }
});

app.get('/api/bookmarks/details', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const [rows] = await pool.query(`
            SELECT p.* FROM places p
            JOIN bookmarks b ON p.id = b.place_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmark details' });
    }
});


app.post('/api/bookmarks/toggle', async (req, res) => {
    const { userId, placeId } = req.body;

    if (!userId || !placeId) {
        return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
    }

    try {
        // 이미 있는지 확인
        const [existing] = await pool.query(
            'SELECT id FROM bookmarks WHERE user_id = ? AND place_id = ?',
            [userId, placeId]
        );

        if (existing.length > 0) {
            // 있으면 삭제
            await pool.query('DELETE FROM bookmarks WHERE user_id = ? AND place_id = ?', [userId, placeId]);
            res.json({ success: true, isBookmarked: false });
        } else {
            // 없으면 추가
            await pool.query('INSERT INTO bookmarks (user_id, place_id) VALUES (?, ?)', [userId, placeId]);
            res.json({ success: true, isBookmarked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '북마크 저장 중 오류가 발생했습니다.' });
    }
});

// --- Auth Routes ---


// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        if (!email || !password || !nickname) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)', [email, hashedPassword, nickname]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, nickname: user.nickname },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profile_image
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Profile Image Upload
app.post('/api/user/profile-image', upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ error: 'User ID required' });
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const imagePath = `/uploads/profiles/${req.file.filename}`;
        await pool.query('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, userId]);

        res.json({ success: true, profileImage: imagePath });
    } catch (error) {
        console.error('Profile upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
});

// Update Points and Get User Info
app.get('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

        let user = rows[0];
        const now = new Date();
        const lastPoint = user.last_point_at ? new Date(user.last_point_at) : null;

        // Check 24 hours (86,400,000 ms)
        if (!lastPoint || (now - lastPoint) >= 24 * 60 * 60 * 1000) {
            await pool.query('UPDATE users SET points = points + 1, last_point_at = ? WHERE id = ?', [now, userId]);
            // Refresh user data after update
            const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            user = updatedRows[0];
        }

        res.json({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            profile_image: user.profile_image,
            points: user.points
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});



// --- Chat Endpoint ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Prompt Logic
        const koreanPromptPrefix = `You are an AI tutor specializing in Korean language and culture for foreign learners.
Please follow these rules for your response:
1. **Response Language**: Always respond in **English**.
2. **Tone**: Friendly, helpful, and natural.
3. **Content**:
   - If the user asks about slang, new words, or abbreviations (e.g., ㄱㅊ, ㅈㅅ, JMT):
     - Explain the meaning clearly in English.
     - Provide 1-2 example sentences with Korean and English translations.
     - Explain the cultural context if necessary.
   - Do NOT change or guess the input word/slang; use it exactly as provided.
4. **Style**: Easy to understand, detailed but concise.

User Message:
${message}

Now, generate a helpful response in English based on the above rules.
`;

        const payload = {
            model: "gemma3:4b", // Updated to gemma3:4b
            prompt: koreanPromptPrefix,
            stream: false
        };

        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama Error: ${errorText}`);
        }

        const data = await response.json();
        const reply = data.response;
        const slangList = [];

        res.json({ reply, slang: slangList });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

// Delete User Account
app.delete('/api/user/:id', async (req, res) => {
    const userId = req.params.id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Delete Bookmarks first
        await connection.query('DELETE FROM bookmarks WHERE user_id = ?', [userId]);

        // 2. Delete User
        const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        await connection.commit();
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Account deletion error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    } finally {
        connection.release();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Serving static files from ${__dirname}`);
});
