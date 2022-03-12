const express = require('express');
const router = express.Router();
const {check, validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkIfAdmin = require('../../middleware/verifyAdminToken')
const Admin = require('../../models/Admin');
const ApiError = require('../../error/ApiError');

 

router.post('/login', [
    body('email').notEmpty().isEmail().withMessage("Please provide a valid email"),
    body('password').notEmpty().isLength({min: 16, max: 64}).withMessage('Password has to be between 16-64 characters')
], async(req, res, next) => {

    // validate login
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(ApiError.badRequest({errors: errors.array()}));
    }

    //login and return JWT-token
    try {
        const admin = await Admin.findOne({email: req.body.email});
        if(!admin) return next(ApiError.badCredentials('No user or bad credentials'));
        
        //password correct
        const validPass = await bcrypt.compare(req.body.password, admin.password);
        if(!validPass){
            return next(ApiError.badCredentials('No user or bad credentials'));
        } else{
            const token = jwt.sign({_id: admin._id}, process.env.TOKEN_SECRET, { expiresIn: '1d' });
            return res.header('auth-token', token).send();
        }

    } catch (error) {
        return next(ApiError.internal());
    }
    
});

router.post('/register', 
checkIfAdmin,
[
    body('email').notEmpty().isEmail().withMessage("Please provide a valid email"),
    body('password').notEmpty().isLength({min: 16, max: 64}).withMessage('Password has to be between 16-64 characters')
], 
async(req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(ApiError.badRequest({errors: errors.array()}));
    }
    // Check if Admin already exists in database
    try {
        const adminExists = await Admin.findOne({email: req.body.email});
        if(adminExists) return next(ApiError.badRequest('email is already in use'));
    } catch (error) {
        return next(ApiError.internal());
    }
    
    // Hash password with Bcrypt with 12-rounds salt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    //create Admin in DB
    const newAdmin = new Admin(
        {
            email: req.body.email,
            password: hashedPassword,
        });
    try {
        const savedAdmin = await newAdmin.save();
        res.json('New admin registered!');
    } catch (error) {
        return next(ApiError.internal);
    }
});

module.exports = router;