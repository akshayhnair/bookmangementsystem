// app/routes/sendEmails.js
const express = require('express');
const router = express.Router();
const Queue = require('bull');
const nodemailer = require('nodemailer');
const EmailTemplate = require('../model.js/EmailtemplateModel');
const EmailAddress = require('../model.js/EmailModel');
const redisConfig =require('./redisConfig')


const redisCloudURL = {redisConfig};

const emailQueue = new Queue('emailQueue',{
    redis: redisCloudURL
});

emailQueue.client.on('connect', () => {
    console.log('Connected to Redis Cloud');
});

emailQueue.client.on('error', (error) => {
    console.error('Error connecting to Redis Cloud:', error);
});
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lindsay68@ethereal.email',
        pass: '4fu9s7Cu6Fwq2DwMnj'
    }
});


// Route to send bulk emails with desired template
router.post('/send-bulk-emails', async (req, res) => {
    try {
        const { groupName, templateId } = req.body;

        // Fetch email template by templateId
        const emailTemplate = await EmailTemplate.findById(templateId);

        if (!emailTemplate) {
            return res.status(404).json({ error: 'Email template not found' });
        }

        // Fetch recipient email addresses associated with the specified group
        const emailAddresses = await EmailAddress.find({ group: groupName });

        if (!emailAddresses || emailAddresses.length === 0) {
            return res.status(404).json({ error: 'No email addresses found for the specified group' });
        }

        // Tracking variables
        let successCount = 0;
        let failureCount = 0;

                // Array to hold promises for adding emails to the queue
                

        // Sending bulk emazils
        for (const emailAddress of emailAddresses) {
            try {
                await emailQueue.add({
                    recipient: emailAddress.email,
                    subject: emailTemplate.subject,
                    body: emailTemplate.body
                });
                successCount++;
            } catch (error) {
                console.error(`Error adding email to the queue:`, error);
                failureCount++;
            }
        }

      

        res.json({ 
            message: 'Bulk emails sending process completed',
            successCount,
            failureCount
        });
    } catch (error) {
        console.error('Error sending bulk emails:', error);
        res.status(500).json({ error });
    }
});
// Function to send email

// Process jobs from the email queue
emailQueue.process(async (job) => {
    const { recipient, subject, body } = job.data;
       
    try {
        // Construct email message
        const mailOptions = {
            from: '"ict"<lindsay68@ethereal.email>', // Use sender address from your configuration
            to: recipient, // Use recipient address
            subject: subject,
            text: body
        };

        // Send email using nodemailer transporter
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipient}`);
        // console.log(recipient) 
        // console.log(subject)
        // console.log(body)
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});


module.exports = router;