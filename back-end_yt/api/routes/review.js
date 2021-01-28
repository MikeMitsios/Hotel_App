const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const Review = require('../models/review');
const Apartment = require("../models/apartments");

router.post('/',async (req,res,next) => {
    // console.log(req.body);
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        renterid: req.body.renterid,
        apartid: req.body.apartid,
        date: req.body.date,
        text: req.body.text,
        grade: req.body.grade,
    });
    await review.save().then(
        
        result => {
        // console.log("new review");
        // console.log(result);
        res.status(200).json({
            message: 'Created a review',
            createdReview : {
                renterid: result.renterid,
                apartid: result.apartid,
                date: result.date,
                text: result.text,
                grade: result.grade,
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
    const id = req.body.apartid
    var reviews_num = 0
    await Apartment.findById(id)
        .select('rep_num lon _id ')
        .exec()
        .then(doc => {
            //console.log("From database",doc);
            reviews_num = doc.rep_num
            //console.log("took rep_num == ",reviews_num);
            // if(doc){
                
            //     res.status(200).json({
            //         Apartment: doc,
            //     });
            // }else{
            //     res.status(404).json({message:'No valid entry found for provided ID'});
            // }
            
        })
        .catch(err => {
            console.log(err);
            // res.status(500).json({error:err});
        });
   
        var value = reviews_num+1;
        //console.log("value ==== "+value);
        
    var sum = 0;
    await Review.find({apartid : id})
        //.select('lat lon _id ')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                review: docs.map(doc =>{
                    sum = sum + doc.grade
                })
            };
            
        })
        .catch(err => {
            console.log(err);
            
        });
    // console.log("sum === "+sum);
    // console.log("req.body.grade === "+req.body.grade);
    // console.log("value === "+value);
    var avg = (sum/value).toFixed(2);
    // console.log("avg === "+avg);
    await Apartment.update({_id:id}, {$set: {rep_num : value} })
    .exec()
    // .then(result1 => {
    //     console.log("resultsss111");
    //     console.log(result1);
    // })
    .catch(err => {
        console.log(err);
        // res.status(500).json({
        //     error:err
        // });
    });
    await Apartment.update({_id:id}, {$set: {average : avg} })
    .exec()
    // .then(result1 => {
    //     console.log("resultsss111");
    //     console.log(result1);
    // })
    .catch(err => {
        console.log(err);
        // res.status(500).json({
        //     error:err
        // });
    });
    matrix_factor();
});


router.get('/',(req,res,next) => {
    Review.find()
        //.select('lat lon _id max_people bed_num min_price type date_array wi_fi kitchen room_num')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                review: docs.map(doc =>{
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


router.get('/byapart/:apartid',(req,res,next) => {
    const apartid = req.params.apartid
    Review.find({apartid : apartid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                review: docs.map(doc =>{
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

router.get('/byrenter/:renterid',(req,res,next) => {
    const renterid = req.params.renterid
    Review.find({ renterid:renterid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                review: docs.map(doc =>{
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


router.patch('/:reviewid',(req,res,next) => {
    const id = req.params.reviewid;
    const updateOps = {};
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    // console.log(updateOps);
    for(var propName in req.body) {
        var value = req.body[propName];
        updateOps[propName] = value;
    }
    Review.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message:'Review updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});


router.delete('/:reviewid',(req,res,next) => {
    Review.remove({_id: req.params.reviewid})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'REview deleted'
            });
        })
        .catch(err=> {
            // console.log(err);
            res.status(500).json({
                error:err
            });
        });
});


module.exports = router;