const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password:{
        type: String,
        required: true,
        min: 16,
        max: 64
    },
    dateOfRegistration: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Admin', AdminSchema);