const mongoose = require('mongoose');
const MultipleChoice = require('./MultipleChoice');

const ChallengeSessionSchema = mongoose.Schema({
    // type: figure out enums to use for the
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    challenges:{
        type: [MultipleChoice],
        required: true
    }
    
});


module.exports = mongoose.model('ChallengeSession', ChallengeSessionSchema);