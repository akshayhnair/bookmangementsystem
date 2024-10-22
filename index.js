const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const emailroute =require('./Router/Emailroute');
const bulkemail =require('./Router/Emailbulkadress')
const sendemail =require('./Router/Bulkemailsend')
const dotenv = require('dotenv');

const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;
dotenv.config();
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
});

// Route to handle adding an email
// app.post('/emails', async (req, res) => {
//     try {
//         const { name, subject, body } = req.body;

//         // Check if required fields are present
//         if (!name || !subject || !body) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Create a new email instance with the provided data
//         const newEmail = new EmailModel({
//             name: name,
//             subject: subject,
//             body: body,
//         });

//         // Save the new email to the database
//         const savedEmail = await newEmail.save();

//         // Respond with the saved email object
//         res.status(201).json(savedEmail);
//     } catch (error) {
//         console.error('Error saving email:', error);
//         res.status(500).json({ error: 'Error saving email' });
//     }
// });
// //route for handling send mails by id 
// app.get('/send-emails/:id', async (req, res) => {
//     try {
//         // Your code logic goes here
//         res.status(201).json(savedEmail); // Assuming savedEmail is defined
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
app.use('/', emailroute)
app.use('/',bulkemail)
app.use('/',sendemail)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
