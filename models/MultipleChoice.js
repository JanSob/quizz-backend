const mongoose = require('mongoose');
const PremiumContent = require('./PremiumContent');

const MultipleChoiceSchema = mongoose.Schema({

    question:{
        type: String,
        required: true
    },
    wrong:{
        type: [String],
        required: true
    },
    correct:{
        type: [String],
        required: true
    },
    difficulty:{
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('MultipleChoice', MultipleChoiceSchema);