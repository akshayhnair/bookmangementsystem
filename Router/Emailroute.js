// Route Handlers
const express = require('express');
const EmailTemplateModel = require('../model.js/EmailtemplateModel');
const EmailModel = require('../model.js/EmailModel');
const nodemailer = require('nodemailer');
const cors = require('cors');

const router = express.Router();

// Route to handle adding an email template
router.post('/email-templates', async (req, res) => {
    try {
        const { Emailname, subject, body } = req.body ;

        // Check if required fields are present
        if (!Emailname || !subject || !body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new email template instance with the provided data
        const newEmailTemplate = new EmailTemplateModel({
            Emailname: Emailname,
            subject: subject,
            body: body,
        });


        // Save the new email template to the database
        const savedEmailTemplate = await newEmailTemplate.save();

        // Respond with the saved email template object
        res.status(201).json(savedEmailTemplate);
    } catch (error) {
        console.error('Error saving email template:', error);
        res.status(500).json({ error: 'Error saving email template' });
    }
});

//route to get all template addded
router.get('/get-alltemplate',async(req,res)=>{
    try {
        const emailtemplate = await EmailTemplateModel.find();
        console.log(emailtemplate); // Log the fetched data
        res.send(emailtemplate); // Send the fetched data as response
    } catch (error) {
        console.error('Error fetching email templates:', error);
        res.status(500).send('Error fetching email templates. Please try again later.');
    }
});
//route to delete template file
router.delete('/deletetemplatebyid/:id/', async (req, res) => {
    try {
        const id = req.params.id; // Get the id from request params
        const deletedTemplate = await EmailTemplateModel.findByIdAndDelete(id); // Find and delete the template by id
        if (!deletedTemplate) {
            return res.status(404).json({ error: "Template not found" }); // If template with the given id is not found
        }
        console.log(`Template with id ${id} deleted successfully`);
        res.json({ status: "deleted" }); // Respond with success status
    } catch (error) {
        console.error('Error deleting email template:', error);
        res.status(500).json({ error: "Error deleting email template" }); // Respond with internal server error if an error occurs
    }
});
//route to update template file
router.put("/templateupdate/:id", async (req, res) => {
    try {
        const id = req.params.id; // Get the id from request params
        const updatedTemplate = await EmailTemplateModel.findByIdAndUpdate(id, req.body, { new: true }); // Update the template by id
        if (!updatedTemplate) {
            return res.status(404).json({ error: "Template not found" }); // If template with the given id is not found
        }
        console.log(`Template with id ${id} updated successfully`);
        res.json({ status: `Template with id ${id} updated successfully` }); // Respond with success status
    } catch (error) {
        console.error('Error updating email template:', error);
        res.status(500).json({ error: "Error updating email template" }); // Respond with internal server error if an error occurs
    }
});



module.exports = router;
