const express = require('express');
const router = express.Router();
const {validationResult, body} = require('express-validator');
const MultipleChoice = require('../../models/MultipleChoice');
const checkIfAdmin = require('../../middleware/verifyAdminToken');
const ApiError = require('../../error/ApiError');

// Regex for hex-testing (Mongoose ID-format)
const hex = /[0-9A-Fa-f]{6}/g;



// gets all the filtered multiple-choice challenges
router.get('/query/',
checkIfAdmin, 
async(req, res, next) => {
    customQuery = {};
    const{page = 1, size = 10} = req.query;
    if(req.query.difficulty){customQuery.difficulty = req.query.difficulty;}
    
    try {
        const multipleChoiceChallenges = await MultipleChoice.find(customQuery)
        .limit(size*1)
        .skip((page-1)*size)
        .exec();

        const count = await MultipleChoice.countDocuments(customQuery);

        res.json({content: multipleChoiceChallenges,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            totalElements: count
          });

    } catch (error) {
        return next(ApiError.internal());
    }
});


// gets a specific multiple-choice-challenge
router.get('/index/:id', 
checkIfAdmin, 
async(req, res, next) => {

    if(!hex.test(req.params.id)) return next(ApiError.badRequest('Please provide a valid ID-format'));
    
    try {
        const multipleChoice = await MultipleChoice.findById(req.params.id);
        res.json(multipleChoice);
    } catch (error) {
        return next(ApiError.internal());
    }
});


// gets all the multiple-choice challenges
router.get('/',
checkIfAdmin, 
async(req, res, next) => {
    const{page = 1, size = 10} = req.query;

    try {
        const multipleChoiceChallenges = await MultipleChoice.find()
        .limit(size*1)
        .skip((page-1)*size)
        .exec();

        const count = await MultipleChoice.countDocuments();

        res.json({content: multipleChoiceChallenges,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            totalElements: count
          });

    } catch (error) {
        return next(ApiError.internal());
    }
});


// submit a multiple-choice challenge
router.post('/',
checkIfAdmin,
[
    body('question').notEmpty().withMessage('question cannot be empty'),
    body('wrong').notEmpty().withMessage('wrong-array cannot be empty'),
    body('correct').notEmpty().withMessage('correct-array cannot be empty'),
    body('difficulty').notEmpty().withMessage('difficulty cannot be empty')
] ,async(req, res, next) => {  

    // Validation part 2
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //console.log({errors: errors.array()});
        return next(ApiError.badRequest({errors: errors.array()}));
    }

    // Create and send new mc-challenge to DB
    const multipleChoice = new MultipleChoice({
        question: req.body.question,
        wrong: req.body.wrong,
        correct: req.body.correct,
        difficulty: req.body.difficulty,

    });

    try{
        const savedPost = await multipleChoice.save();
        res.json(savedPost);
    } catch(error){
        return next(ApiError.internal());
    }
});



// updates a multiple-choice challenge
router.patch('/', 
checkIfAdmin,
[
    body('question').notEmpty().withMessage('question cannot be empty'),
    body('wrong').notEmpty().withMessage('wrong-array cannot be empty'),
    body('correct').notEmpty().withMessage('correct-array cannot be empty'),
    body('difficulty').notEmpty().withMessage('difficulty cannot be empty')
],
async(req, res, next) => {

    // Validation part 2
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(ApiError.badRequest({errors: errors.array()}));
    }

    if(!hex.test(req.body._id)) return next(ApiError.badRequest('Please provide a valid ID-format'));

    try {
        const multipleChoice = await MultipleChoice.findByIdAndUpdate(req.body._id,{
            question: req.body.question,
            wrong: req.body.wrong,
            correct: req.body.correct,
            difficulty: req.body.difficulty,
        });
        res.json(multipleChoice);
    } catch (error) {
        return next(ApiError.internal());
    }
});



// deletes a multiple-choice challenge
router.delete('/index/:id', 
checkIfAdmin,
async(req, res, next) => {
    if(!hex.test(req.params.id)) return next(ApiError.badRequest('Please provide a valid ID-format'));

    try {
        const result = await MultipleChoice.deleteOne({_id: req.params.id});
        res.json(result);
    } catch (error) {
        return next(ApiError.internal());
    }
});

module.exports = router;