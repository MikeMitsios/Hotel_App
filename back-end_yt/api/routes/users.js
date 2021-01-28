const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 

const User = require('../models/user');


router.get('/',(req,res,next) => {
    User.find()
        .select('username password _id')
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                user: docs.map(doc =>{
                    return{
                        username: doc.username,
                        password: doc.password,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            description:'If you want to GET the item click bellow',
                            url: 'http://localhost:3001/users/'+doc._id
                        }
                    }
                })
            };
            // if(docs.length >= 0){
                res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message:'No entries found'
            //     });
            // }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
});

router.post('/',(req,res,next) => { 
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username:req.body.username,
        password:req.body.password
    });
    user.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created a users',
            createdUser : {
                username: result.username,
                password: result.password,
                _id: result._id,
                request: {
                    type: 'GET',
                    description:'If you want to GET the new item click bellow',
                    url :'http://localhost:3001/users/'+result._id
                }
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

router.get('/:userId',(req,res,next) => {
    const id = req.params.userId
    User.findById(id)
        .select('username password _id')
        .exec()
        .then(doc => {
            console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        description:'If you want to GET all items click bellow',
                        url:'http://localhost:3001/users'
                    }
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

router.patch('/:userId',(req,res,next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id:id}, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message:'User updated',
                request: {
                    type: 'GET',
                    description:'If you want to GET the updated item click bellow',
                    url:'http://localhost:3001/users/'+id 
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.delete('/:userId',(req,res,next) => {
    const id = req.params.userId;
    User.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message:'Product deleted',
                request: {
                    type: 'POST',
                    description:'If you want to POST an item click below (the body is presented down bellow)',
                    url: 'http://localhost:3001/users/',
                    body: {username: 'String',password:'String'}
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

module.exports = router;