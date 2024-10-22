const express = require('express');
const router = express.Router();
const EmailAddress = require('../model.js/EmailModel');


// router.post('/addemail', async (req, res) => {
//     try {
//         const { emails } = req.body;
//         if (Array.isArray(emails)) {
//             // Bulk addition of email addresses
//             const emailAddresses = await EmailAddress.insertMany(emails.map(email => ({ email })));
//             res.json(emailAddresses);
//         } else {
//             // Single email address addition
//             const emailAddress = new EmailAddress({ email: emails });
//             await emailAddress.save();
//             res.json(emailAddress);
//         }
//         } catch (error) {
//         res.status(500).json({ error:"server error"});
//     }
// });

// Route to add email addresses
router.post('/addemail', async (req, res) => {
    try {
        const { groups } = req.body;

        if (!groups || !Array.isArray(groups)) {
            return res.status(400).json({ error: 'Groups must be provided as an array' });
        }

        const bulkOperations = [];

        for (const group of groups) {
            if (!group.label || !group.emails || !Array.isArray(group.emails)) {
                return res.status(400).json({ error: 'Each group must have a label and an array of emails' });
            }

            const emails = group.emails.map(email => ({ email, group: group.label }));
            bulkOperations.push(...emails);
        }

        const emailAddresses = await EmailAddress.insertMany(bulkOperations);
        res.json(emailAddresses);
    } catch (error) {
        console.error('Error adding email addresses:', error);
        res.status(500).json({ error: 'internal server error'  });
    }
});

router.get('/get-groups', async (req, res) => {
    try {
        const emailGroups = await EmailAddress.distinct('group');
        res.json(emailGroups);
    } catch (error) {
        console.error('Error fetching email groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete email address by email
router.delete('/deleteemail/:email', async (req, res) => {
    try {
        const { email } = req.params;
        await EmailAddress.deleteOne({ email });
        res.json({ message: 'Email address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error});
    }
});
// Route to delete all email addresses
router.delete('/deleteall', async (req, res) => {
    try {
        await EmailAddress.deleteMany({});
        res.json({ message: 'All email addresses deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete all email addresses
router.delete('/deletegroup/:group', async (req, res) => {
    try {
        const { group } = req.params;
        await EmailAddress.deleteMany({group});
        res.json({ message: 'group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to search email addresses by group name
router.get('/searchforgroup', async (req, res) => {
    try {
        const { query } = req.query;
        const emailAddresses = await EmailAddress.find({ group: { $regex: query, $options: 'i' } });
        res.json(emailAddresses);
    } catch (error) {
        console.error('Error searching for email addresses by group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
