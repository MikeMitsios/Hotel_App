const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    renterid: {type: String,required: true},
    apartid: {type: String,required: true},
    date: {type: Date,required: true},
    text: {type: String},
    grade: {type: Number},
});

module.exports = mongoose.model('Review',reviewSchema);