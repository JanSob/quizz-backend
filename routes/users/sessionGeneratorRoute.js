const express = require('express');
const router = express.Router();
const { Mongoose } = require('mongoose');
const ApiError = require('../../error/ApiError');
const verifyUserToken = require('../../middleware/verifyUserToken');
const MultipleChoice = require('../../models/MultipleChoice');



// return x multiple-choice-challenges at random
router.get('/session/', 
//verifyUserToken,
async(req, res, next) => {
    // TODO: implement optional filter for difficulty: https://masteringjs.io/tutorials/mongoose/aggregate
    if(!req.query.sessionSize) return next(ApiError.badRequest('No session size provided'));
        sessionSize = parseInt(req.query.sessionSize);
        if(sessionSize == NaN || sessionSize <= 0 || sessionSize > 10) next(ApiError.badRequest('Bad session-size request'));
    try {
        const session = await MultipleChoice.aggregate([{$sample: {size: sessionSize}}]);
        res.json(session);
    } catch (error) {
        return next(ApiError.internal);
    }
});

module.exports = router;