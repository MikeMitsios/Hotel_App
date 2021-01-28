const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const Chat = require('../models/chat');

router.post('/',(req,res,next) => {
    console.log(req.body);
    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        renterid: req.body.renterid,
        hostid: req.body.hostid,
        messages: req.body.messages,
        renter_username: req.body.renter_username,
        host_username: req.body.host_username,

    });
    chat.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created a chat',
            createdChat : {
                renterid: result.renterid,
                hostid: result.hostid,
                messages: result.messages,
                renter_username: result.renter_username,
                host_username: result.host_username,
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



router.get('/byids/:renterid/:hostId',(req,res,next) => {
    const hostid = req.params.hostId
    const renterid = req.params.renterid
    Reservation.find({hostid : hostid} && {renterid : renterid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                chat: docs.map(doc =>{
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


router.patch('/:chatid',async (req,res,next) => {
    const id = req.params.chatid;
    const updateOps = {};
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    for(var propName in req.body) {
        console.log("propName : "+propName);
        var value = req.body[propName];
        updateOps[propName] = value;
    }
    console.log(updateOps);
    // var renterid;
    // var apartid;
    // var date_to;
    await Chat.update({_id:id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Chat updated',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });

});


router.delete('/:chatid',(req,res,next) => {
    Chat.remove({_id: req.params.chatid})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Chat deleted'
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