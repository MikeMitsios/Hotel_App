const mongoose = require('mongoose');

const apartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bed_num: {type: Number,required: true},
    bath_num: {type: Number,required: true},
    type: {type: String,required: true},
    room_num: {type: Number,required: true},
    liv_room: {type: Number,required: true},
    area: {type: Number,required: true},
    description: {type: String,required: true},
    max_people: {type: Number,required: true},
    wi_fi: {type: Boolean,required: true},
    cooling: {type: Boolean,required: true},
    heating: {type: Boolean,required: true},
    kitchen: {type: Boolean,required: true},
    tv: {type: Boolean,required: true},
    elevator: {type: Boolean,required: true},
    parking: {type: Boolean,required: true},
    min_price: {type: Number,required: true},
    lat: {type: Number,required: true},
    lon: {type: Number,required: true},
    address: {type: String,required: true},
    title: {type: String,required: true},
    date_array:[{
        Date_from : Date,
        Date_to : Date
         }],//{type: Array},
    price_per_person:{type: Number},
    pub_tra: {type: String,required: true},
    rules: {type: Array},
    apart_images:{type : Array},
    average:{type:Number,required: true},
    rep_num:{type:Number,required: true},
    host_id:{type:String},
    host_username:{type:String},
    host_img:{type:String},
    matrix:{type:Array}
    // array: {type: Array},
    // host_Image: {type: String,required: true},
    // reviews: {type: String[10],required: true},
});

module.exports = mongoose.model('Apartment',apartSchema);