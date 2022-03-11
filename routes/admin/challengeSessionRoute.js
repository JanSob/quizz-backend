const express = require('express');
const router = express.Router();
const { Mongoose } = require('mongoose');
const checkIfAdmin = require('../../../middleware/adminCheck');
const ChallengeSession = require('../../models/ChallengeSession');

// Middleware

// gets a specific challenge-session
router.get('/:id', 
checkIfAdmin, 
async(req, res) => {
    
    try {
        console.log("trying to find challenge-session by id: " + req.params.id);
        const challengeSession = await ChallengeSession.findById(req.params.id);
        res.json(challengeSession);
    } catch (error) {
        res.json({message:error});
    }
});

// gets all the challenge-session
router.get('/',
checkIfAdmin, 
async(req, res) => {
    //let{page = 1, size = 10} = req.query;
    const page = req.query.page;
    const size = req.query.size;
    //console.log("page, size: " + page + "//" + size);
    try {
        const challengeSessions = await ChallengeSession.find()
        .limit(size*1)
        .skip((page-1)*size)
        .exec();

        const count = await ChallengeSession.countDocuments();
        //console.log("count: " + count);


        res.json({content: challengeSessions,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            totalElements: count
          });

    } catch (error) {
        res.json({message:error});
    }
});



// submit a challenge-session
router.post('/',
checkIfAdmin,
async(req, res) => {  

    // Validation part 2
    
    // Create and send new challenge-session to DB
    const challengeSession = new ChallengeSession({
        name: req.body.name,
        description: req.body.description,
        challenges: req.body.challenges
    });

    try{
        const savedChallengeSession = await challengeSession.save();
        res.json(savedChallengeSession);
    }catch(error){
        res.status(400);
        res.json({message: error});
    }
});

// updates a challenge-session
router.patch('/', 
checkIfAdmin,
async(req, res) => {
    try {
        const challengeSession = await ChallengeSession.findByIdAndUpdate(req.body._id,{
            name: req.body.name,
            description: req.body.description,
            challenges: req.body.challenges
        });
        res.json(challengeSession);
    } catch (error) {
        res.json({message:error});
    }
});


// deletes a challenge-session
router.delete('/:id', 
checkIfAdmin,
async(req, res) => {
    try {
        const challengeSession = await ChallengeSession.deleteOne({_id: req.params.id});
        res.json(challengeSession);
    } catch (error) {
        res.json({message:error});
    }
});

module.exports = router;