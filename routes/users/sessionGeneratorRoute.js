const express = require('express');
const router = express.Router();
const { Mongoose } = require('mongoose');
const verifyUserToken = require('../../middleware/verifyUserToken');
const MultipleChoice = require('../../models/MultipleChoice');



// return x multiple-choice-challenges at random
// TODO: uncomment userToken-check
router.get('/session/', 
//verifyUserToken,
async(req, res) => {
    // TODO: check if sessionSize exists and is valid (not negative, not too big, an Int etx)
    // TODO: implement optional filter for difficulty: https://masteringjs.io/tutorials/mongoose/aggregate
    sessionSize = parseInt(req.query.sessionSize);
    console.log("Session-size: " + sessionSize);
    try {
        //const filter = { $sample: { $size: sessionSize } };
        const session = await MultipleChoice.aggregate([{$sample: {size: sessionSize}}]);
        res.json(session);
    } catch (error) {
        res.status(400);
        res.json('Bad request');
    }
});

module.exports = router;