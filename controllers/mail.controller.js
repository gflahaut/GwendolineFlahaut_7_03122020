const express = require('express');
const router = express.Router();
const model = require("../models/mail.model");
const nodemailer = require('nodemailer');

exports.sendMail= async function sendMail(){
    let newMail = { ...req.body};
    try{
        let result = await mail.model.createMail( newMail);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: newMail.sender,
                pass: process.env.PASS
            }
        });
        const mailOptions={ 
            from : newmail.sender,
            to : newmail.recipient,
            subject : newmail.subject,
            text : newmail.text,
        }
        transporter.sendMail(mailOptions , function(error, info){  
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log('Email sent: ' + info.response);
            res.status(201).json({ message: 'Email sent:'+ info.response });
        }});
    }
    catch(error){
        console.log(error);
        res.status(400).json({ error });
    }
}