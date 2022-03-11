const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {check, validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ROLE = require('../data');

 

router.post('/login', [
    body('email').notEmpty().isEmail().withMessage("Please provide a valid email"),
    body('password').notEmpty().isLength({min: 16, max: 64}).withMessage('Password has to be between 16-64 characters')
], async(req, res) => {

    // validate login
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //login and return JWT-token
    try {
        console.log("trying to query DB");
        const admin = await Admin.findOne({email: req.body.email});
        if(!admin) return res.status(400).send('Bad credentials');
        
        //password correct
        const validPass = await bcrypt.compare(req.body.password, admin.password);
        if(!validPass){
            return res.status(400).send('Bad credentials');
        } else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1d' });
            return res.header('auth-token', token).send();
        }

    } catch (error) {
        console.log('There was an error when trying to log in: ' + error.message);
        res.json({message: error})
    }
    
});

router.post('/register', 
checkIfAdmin,
[
    body('email').notEmpty().isEmail().withMessage("Please provide a valid email"),
    body('password').notEmpty().isLength({min: 16, max: 64}).withMessage('Password has to be between 16-64 characters')
], 
async(req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    // Check if Admin already exists in database
    try {
        const userExists = await User.findOne({email: req.body.email});
        if(userExists) return res.status(400).send('Admin already exists in DB');
    } catch (error) {
        res.json({message: error});
        return res.status(400);
    }
    
    // Hash password with Bcrypt with 19-rounds salt
    const salt = await bcrypt.genSalt(19);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create Admin
    const newUser = new User(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: ROLE.BASIC
        });
    try {
        const savedUser = await newUser.save();
        res.json('New admin registered!');
    } catch (error) {
        res.json({message: error});
    }
});

module.exports = router;