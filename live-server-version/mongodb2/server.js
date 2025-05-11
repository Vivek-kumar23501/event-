const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());  // Parse JSON data in request body
app.use(express.static('public')); // Serve static files (like HTML, CSS, JS)

const users = {
    "eventincharge@example.com": { password: "event123", role: "eventincharge" }
};

// Handle login request
app.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    if (role === 'eventincharge' && users[email] && users[email].password === password) {
        // Send JSON response with success
        res.json({ success: true, message: 'Login successful!' });
    } else {
        // Send JSON response with error
        res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }
});

// Serve eventincharge dashboard HTML after successful login
app.get('/eventinchargedashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'eventinchargedashboard.html'));
});

// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
