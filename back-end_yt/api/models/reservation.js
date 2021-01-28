const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    renterid: {type: String,required: true},
    hostid: {type: String,required: true},
    apartid: {type: String,required: true},
    date_from: {type: Date,required: true},
    date_to: {type: Date,required: true},
    reviewed:{type: Boolean,required: true},
    accepted: {type: Boolean,required: true},
});

module.exports = mongoose.model('Reservation',reservationSchema);