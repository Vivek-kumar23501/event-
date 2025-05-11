const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define the Student model
const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  roll: String,
  email: { type: String, unique: true },
  branch: String,
  mobile: String,
  password: String,
}));

// Route for student registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, roll, email, branch, mobile, password } = req.body;

    // Check if the email is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student record
    const newStudent = new Student({ 
      name, 
      roll, 
      email, 
      branch, 
      mobile, 
      password: hashedPassword 
    });
    await newStudent.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Route for student login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Successful login
    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
