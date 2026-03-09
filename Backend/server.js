const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

// Mock database (replace with real DB)
let users = [];
let streaks = [];

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        users.push({
            id: users.length + 1,
            username,
            password: hashedPassword
        });
        
        res.json({ success: true, message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id }, 'your_secret_key');
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get streaks
app.get('/api/streaks/:userId', (req, res) => {
    const userStreaks = streaks.filter(s => s.userId == req.params.userId);
    res.json(userStreaks);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});