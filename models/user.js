const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min:8,
        default:'googleSignIn'
    },
    accountType:{
        type: String,
        default:'nonGoogleAccount'
    },
    hasLoggedInBefore: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;