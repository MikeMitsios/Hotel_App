const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    renterid: {type: String,required: true},
    hostid: {type: String,required: true},
    messages: {type: Array},
    renter_username: {type: String},
    host_username: {type: String},
});

module.exports = mongoose.model('Chat',chatSchema);