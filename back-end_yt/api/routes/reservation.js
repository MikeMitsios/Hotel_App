const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const Reservation = require('../models/reservation');
const Apartment = require("../models/apartments");
const Review = require("../models/review");


router.post('/',checkAuth,(req,res,next) => {
    // console.log(req.body);
    const reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        renterid: req.body.renterid,
        hostid: req.body.hostid,
        apartid: req.body.apartid,
        date_from: req.body.date_from,
        date_to: req.body.date_to,
        accepted: false,
        reviewed: false,
    });
    reservation.save().then(result => {
        // console.log(result);
        res.status(201).json({
            message: 'Created a reservation',
            createdReservation : {
                renterid: result.renterid,
                hostid: result.hostid,
                apartid: result.apartid,
                date_from: result.date_from,
                date_to: result.date_to,
                accepted: result.accepted,
                reviewed: result.reviewed,
                _id: result._id,
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


router.get('/',(req,res,next) => {
    Reservation.find()
        //.select('lat lon _id max_people bed_num min_price type date_array wi_fi kitchen room_num')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                reservation: docs.map(doc =>{
                    // console.log(doc);
                    return{
                        doc
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
});


router.get('/byid/:reservId',checkAuth,(req,res,next) => {
    const id = req.params.reservId
    Reservation.findById(id)
        //.select('lat lon _id apart_image1')
        .exec()
        .then(doc => {
            // console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    Reservation: doc,
                });
            }else{
                res.status(404).json({message:'No valid entry found for provided ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.get('/byhost/:hostId',checkAuth,(req,res,next) => {
    const hostid = req.params.hostId
    Reservation.find({hostid : hostid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                reservation: docs.map(doc =>{
                    // console.log(doc);
                    return{
                        doc
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });

        

});

router.get('/byrenter/:renterid',checkAuth,(req,res,next) => {
    const renterid = req.params.renterid
    Reservation.find({ renterid:renterid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                reservation: docs.map(doc =>{
                    console.log(doc);
                    return{
                        doc
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.get('/byaccept/:hostid',checkAuth,(req,res,next) => {
    const hostid = req.params.hostid
    Reservation.find({hostid : hostid} && {accepted:false})
        
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
           
            // console.log(docs);
            const response = {
                count: docs.length,
                reservation: docs.map(doc =>{
                    //console.log(doc);
                    return{
                        doc
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.patch('/:reservId',async (req,res,next) => {
    const id = req.params.reservId;
    const updateOps = {};
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    for(var propName in req.body) {
        // console.log("propName : "+propName);
        var value = req.body[propName];
        updateOps[propName] = value;
    }
    // console.log(updateOps);
    // var renterid;
    var apartid;
    var date_from;
    var date_to;
    
    await Reservation.findById(id)
    .exec()
    .then(result => {
        // console.log("result  ",result);
        date_from = result.date_from;
        date_to = result.date_from;
        apartid = result.apartid;
    })
    .catch(err => {
        console.log(err);
    });
    
    
    var dates;
    await Apartment.findById(apartid)
    .select('title _id type date_array')
    .exec()
    .then(result => {
        // console.log("apart:",result);
        dates = new Array(result.date_array.length)
        dates = result.date_array
        console.log("dates:",dates);
    })
    .catch(err => {
        console.log(err);
        
    });
    var pos;
    for (let i = 0; i < dates.length; i++) {
        if(dates[i].Date_from.toISOString().slice(0,10) <= date_from.toISOString().slice(0,10)  &&  dates[i].Date_to.toISOString().slice(0,10) >= date_to.toISOString().slice(0,10) ){
            pos =i;
            break;
        }
    }
    var new_dates=[];
    for (let i = 0; i < dates.length; i++) {
        if(pos != i){
            new_dates.push(dates[i]);
        }
    }
    var da;
    var dateeee = new Date;
    if(dates[pos].Date_from.toISOString().slice(0,10) === date_from.toISOString().slice(0,10) && dates[pos].Date_to.toISOString().slice(0,10) != date_to.toISOString().slice(0,10) ){//
        da = {Date_from: date_to , Date_to:dates[pos].Date_to};
        new_dates.push(da);
    }
    if(dates[pos].Date_from.toISOString().slice(0,10) < date_from.toISOString().slice(0,10) ){
        da = {Date_from: dates[pos].Date_from , Date_to:date_from};
        new_dates.push(da);
        if(dates[pos].Date_to.toISOString().slice(0,10) > date_to.toISOString().slice(0,10) ){
            dateeee.setDate(date_to.getDate());
            da = {Date_from: dateeee , Date_to:dates[pos].Date_to};
            new_dates.push(da);
        }
    }
    // console.log("new date == ",new_dates);
    //console.log("pos = ",pos);
    await Apartment.update({_id:apartid}, {$set: {date_array : new_dates} })
            .exec()
            .catch(err => {
                console.log(err);
            });
    await Reservation.update({_id:id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Reservation updated',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });


    // await Reservation.findById(id)
    // .exec()
    // .then(doc => {
        
    //     if(doc){
    //         console.log("hello?");
    //          console.log(doc);
    //         renterid = doc.renterid
    //         apartid = doc.apartid
    //         date_to = doc.date_to
    //         console.log("result:::");
    //         // console.log(doc);
        
            
    //     }
        
    // })
    // .catch(err => {
    //     console.log(err);
        
    // });


    // console.log("Equal");
    // console.log("renterid "+renterid);
    // if(req.body.accepted=="true"){    
    //     console.log("mpike"); 
        
    //     await Review.insertMany({_id: new mongoose.Types.ObjectId(),renterid: renterid,apartid: apartid,date: date_to,})
    //     .then()
    //     .catch(err => {
    //         console.log(err);
            
    //     });
    // }
    // console.log("f_wequal");
      
});


router.delete('/:reservId',checkAuth,(req,res,next) => {
    Reservation.remove({_id: req.params.reservId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Reservation deleted'
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});


module.exports = router;