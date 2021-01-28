const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

router.get('/',checkAuth,(req,res,next) => {
    User.find()
        .select('email accepted password username name lastname role _id')
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                user: docs.map(doc =>{
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


router.get('/:userid',checkAuth,(req,res,next) => {
    const id = req.params.userid
    User.findById(id)
        //.select('lat lon _id average rep_num ')
        .exec()
        .then(doc => {
            // console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    user: doc,
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

router.get('/byusername/:username',checkAuth,(req,res,next) => {
    User.find({ username: req.params.username})
        //.select('lat lon _id average rep_num ')
        .exec()
        .then(docs => {
            // console.log("From database",docs);
            const response = {
                count: docs.length,
                user: docs.map(doc =>{
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


router.get('/byaccept/show',checkAuth,(req,res,next) => {
    //const id = req.params.userid
    User.find({ accepted: false})
        //.select('lat lon _id average rep_num ')
        .exec()
        .then(doc => {
            // console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    user: doc,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.patch('/:userId',checkAuth,(req,res,next) => {
    const id = req.params.userId;
    const updateOps = {};
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    // console.log(updateOps);
    for(var propName in req.body) {
        var value = req.body[propName];
        updateOps[propName] = value;
    }
    User.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message:'User updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.delete('/:userId',checkAuth,(req,res,next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
})

module.exports = router;