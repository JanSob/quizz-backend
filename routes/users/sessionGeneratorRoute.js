const express = require('express');
const router = express.Router();
const { Mongoose } = require('mongoose');
const verifyUserToken = require('../../middleware/verifyUserToken');
const User = require("../../models/User");



// get a challenge
router.get('/challenge/', 
verifyUserToken,
async(req, res) => {
    
    try {
        const module = await Module.findById(req.query.id).lean();
        res.json(module);
    } catch (error) {
        res.json({message:error});
    }
});

module.exports = router;