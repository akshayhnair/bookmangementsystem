const mongoose = require('mongoose');

const EmailAddressSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // Ensures uniqueness of email addresses
        required: true, // Email address is required
        trim: true, // Trims whitespace from email addresses
        lowercase: true, // Converts email addresses to lowercase
    },
    group: {
        type: String,
        required: true,
        unique: true, 
    }
});

module.exports = mongoose.model('EmailAddress', EmailAddressSchema);