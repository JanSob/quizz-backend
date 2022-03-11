const express = require('express');
const router = express.Router();
const {check, validationResult, body} = require('express-validator');
const { Mongoose } = require('mongoose');
const MultipleChoice = require('../../models/MultipleChoice');
const checkIfAdmin = require('../../middleware/verifyAdminToken');

// Middleware

// gets all the filtered multiple-choice challenges
router.get('/query/',
checkIfAdmin, 
async(req, res) => {
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
        res.json({message:error});
    }
});


// gets a specific multiple-choice-challenge
router.get('/:id', 
checkIfAdmin, 
async(req, res) => {
    
    try {
        const multipleChoice = await MultipleChoice.findById(req.params.id);
        res.json(multipleChoice);
    } catch (error) {
        res.json({message:error});
    }
});

// gets all the multiple-choice challenges
router.get('/',
checkIfAdmin, 
async(req, res) => {
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
        res.json({message:error});
    }
});


// submit a multiple-choice challenge
router.post('/',
checkIfAdmin,
[
    body('question').notEmpty().withMessage('question cannot be empty'),
] ,async(req, res) => {  

    // Validation part 2
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // Create and send new Post to DB
    const multipleChoice = new MultipleChoice({
        question: req.body.question,
        wrong: req.body.wrong,
        correct: req.body.correct,
        difficulty: req.body.difficulty,

    });

    try{
        const savedPost = await multipleChoice.save();
        res.json(savedPost);
    }catch(error){
        res.status(400);
        res.json({message: error});
    }
});

// updates a multiple-choice challenge
router.patch('/', 
checkIfAdmin,
async(req, res) => {
    try {
        console.log("trying to patch: " + req.body._id);
        
        const multipleChoice = await MultipleChoice.findByIdAndUpdate(req.body._id,{
            question: req.body.question,
            wrong: req.body.wrong,
            correct: req.body.correct,
            difficulty: req.body.difficulty,
        });
        res.json(multipleChoice);
    } catch (error) {
        res.json({message:error});
    }
});

// deletes a multiple-choice challenge
router.delete('/:id', 
checkIfAdmin,
async(req, res) => {
    try {
        const multipleChoice = await MultipleChoice.deleteOne({_id: req.params.id});
        res.json(multipleChoice);
    } catch (error) {
        res.json({message:error});
    }
});

module.exports = router;