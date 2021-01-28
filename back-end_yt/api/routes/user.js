const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
    
    
};

const upload = multer({
    storage: storage , 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const User = require('../models/user');

router.post('/signup',(req,res,next) => {
    User.find({username: req.body.Username})
        .exec()
        .then(user => {
            // console.log(req.body);
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exist'
                })
            }else{
                bcrypt.hash(req.body.Password,10,(err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.Email,
                            name: req.body.Name,
                            username:req.body.Username,
                            lastname: req.body.Lastname,
                            role: req.body.Role,
                            // picture: req.body.photo,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                // console.log(result);
                                res.status(201).json({
                                    message : 'User created'
                                });
                            })
                            .catch(err=> {
                                console.log(err);
                                res.status(501).json({
                                    error:err
                                });
                            });
                    }
                })
            }
        })
});


router.post('/signup/photo',upload.single('Image'),(req,res,next) => {
    // console.log(req.body.username);
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            // console.log(req.body.username);
            if(user.length >= 1) {
                return res.status(406).json({
                    message: 'Mail exist'
                })
            }else{
                bcrypt.hash(req.body.password,10,(err,hash) => {
                    if(err){
                        return res.status(502).json({
                            error:err
                        });
                    }else{
                        var accepted;
                        // console.log("role : .",req.body.role,".");
                        if(req.body.role.localeCompare(" hoster ")){
                            accepted = false;
                        }else{
                            accepted = true;
                        }
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            name: req.body.name,
                            username:req.body.username,
                            lastname: req.body.lastname,
                            role: req.body.role,
                            Image: req.body.photo,
                            password: hash,
                            accepted:accepted
                        });
                        user.save()
                            .then(result => {
                                // console.log(result);
                                res.status(201).json({
                                    message : 'User created'
                                });
                            })
                            .catch(err=> {
                                console.log(err);
                                res.status(501).json({
                                    error:err
                                });
                            });
                    }
                })
            }
        })
});

router.get('/',(req,res,next) => {
    User.find()
        //.select('email password username name lastname role _id')
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                user: docs.map(doc =>{
                    return{
                        doc
                        // request: {
                        //     type: 'GET',
                        //     description:'If you want to GET the item click bellow',
                        //     url: 'http://localhost:3001/users/'+doc._id
                        // }
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


router.get('/:userid',(req,res,next) => {
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

router.post('/login',(req,res,next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if(user.length <1){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                        username: user[0].username,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        email: user[0].email,
                        username: user[0].username,
                        name: user[0].name,
                        lastname: user[0].lastname,
                        role: user[0].role,
                        _id:user[0]._id,
                        photo:user[0].Image,
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.post('/passval',(req,res,next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length <1){
                return res.status(401).json({
                    message: 'Auth failed',
                    value:false
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed',
                        value:false
                    });
                }
                if(result){
                    // const token = jwt.sign(
                    //     {
                    //     email: user[0].email,
                    //     userId: user[0]._id
                    // },
                    // process.env.JWT_KEY,
                    // {
                    //     expiresIn: "1h"
                    // }
                    // );
                    return res.status(200).json({
                        message: 'Auth successful',
                        // token: token,
                        value:true
                    });
                    //return true;
                }
                //return false;
                return res.status(200).json({
                    message: 'Auth failed',
                    value:false
                });
            })
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.get('/:userid',(req,res,next) => {
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

router.delete('/:userId',(req,res,next) => {
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