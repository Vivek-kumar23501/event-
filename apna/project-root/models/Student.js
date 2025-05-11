const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    roll: String,
    email: { type: String, unique: true },
    branch: String,
    mobile: String,
    password: String,
});

module.exports = mongoose.model('Student', studentSchema);
