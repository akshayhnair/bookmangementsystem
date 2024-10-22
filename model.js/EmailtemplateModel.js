const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    Emailname: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EmailTemplateModel = mongoose.model('EmailTemplate', emailSchema);

module.exports = EmailTemplateModel;
