const mongoose = require('mongoose');
// const fs = require('fs'); 
// const path = require('path'); 
// require('dotenv/config'); 

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String,  required:true},
    username: {type: String, required:true},
    name: {type: String, required:true},
    lastname: {type: String, required:true},
    role: {type: String, required:true},
    Image:{type: String },
    accepted:{type: Boolean,required:true },
    matrix:{type:Array},
});

module.exports = mongoose.model('User',userSchema);