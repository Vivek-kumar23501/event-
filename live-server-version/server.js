const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.json()); // Duplicate line added
app.use(express.static(path.join(__dirname))); // Serve static files like CSS, JS, and images

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/UserDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Serve home.html as the default page
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    studentId: { type: String },
    department: { type: String },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/register', async (req, res) => {
    const { name, email, studentId, department, password, confirmPassword } = req.body;

    console.log(req.body); // Debug: Log all received data

    if (password.trim() !== confirmPassword.trim()) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, studentId, department, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));