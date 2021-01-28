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


function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344 
        return dist;
    }
}


const Apartment = require('../models/apartments');
const { remove } = require("../models/apartments");
const { matrix_factor } = require("../middleware/matrix");
const User = require('../models/user');


router.post('/',checkAuth,upload.single('apart_Image1'),(req,res,next) => {
    // console.log(req.body);
    const apartments = new Apartment({
        _id: new mongoose.Types.ObjectId(),
        bed_num: req.body.Beds_num,
        bath_num: req.body.WC_num,
        type: req.body.Place_type,
        room_num: req.body.Bedroom_num,
        liv_room: req.body.Livingroom,
        area: req.body.Room_area,
        description: req.body.Description,
        rules: req.body.Rules_list,
        max_people: req.body.Max_people,
        wi_fi: req.body.wi_fi,
        cooling: req.body.cooling,
        heating: req.body.heating,
        kitchen: req.body.kitchen,
        tv: req.body.tv,
        elevator: req.body.elevator,
        parking: req.body.parking,
        min_price: req.body.Min_price,
        title: req.body.Title_dep,
        date_array: req.body.Date_list,
        lat: req.body.lat,
        lon: req.body.lon,
        address: req.body.Address,
        price_per_person: req.body.Extra_person_price,
        pub_tra: req.body.pub_tra,
        apart_images : req.body.Photos_list,
        average: 0,
        rep_num: 0,
        host_id:req.body.host_id,
        host_username:req.body.host_username,
        host_img:req.body.host_img,
        // host_Image: {type: String,required: true},
        // reviews: {type: String[10],required: true},
    });
    // console.log(req.body);
    apartments.save().then(result => {
        //console.log(result);
        res.status(201).json({
            message: 'Created an apartment',
            createdApartment : {

                bed_num: result.bed_num,
                bath_num: result.bath_num,
                type: result.type,
                room_num: result.room_num,
                liv_room: result.liv_room,
                area: result.area,
                description: result.description,
                rules: result.rules,
                max_people: result.max_people,
                wi_fi: result.wi_fi,
                cooling: result.cooling,
                heating: result.heating,
                kitchen: result.kitchen,
                tv: result.tv,
                elevator: result.elevator,
                parking: result.parking,
                min_price: result.min_price,
                title: result.title,
                date_array: result.date_array,
                lat: result.lat,
                lon: result.lon,
                address: result.address,
                price_per_person: result.price_per_person,
                pub_tra: result.pub_tra,
                // apart_Image1: req.body.apart_Image1,
                // apart_Image2: req.body.apart_Image2,
                apart_images : result.apart_images,
                average: result.average,
                rep_num: result.rep_num,
                host_id:result.host_id,
                host_username:result.host_username,
                host_img:result.host_img,
                _id: result._id,
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(501).json({
            error:err
        });
    });
});

router.post('/update',checkAuth,upload.single('apart_Image1'),(req,res,next) => {
    // console.log(req.body);
    const apartments = new Apartment({
        _id: req.body._id,
        bed_num: req.body.bed_num,
        bath_num: req.body.bath_num,
        type: req.body.type,
        room_num: req.body.room_num,
        liv_room: req.body.liv_room,
        area: req.body.area,
        description: req.body.description,
        rules: req.body.rules,
        max_people: req.body.max_people,
        wi_fi: req.body.wi_fi,
        cooling: req.body.cooling,
        heating: req.body.heating,
        kitchen: req.body.kitchen,
        tv: req.body.tv,
        elevator: req.body.elevator,
        parking: req.body.parking,
        min_price: req.body.min_price,
        title: req.body.title,
        date_array: req.body.date_array,
        lat: req.body.lat,
        lon: req.body.lon,
        address: req.body.address,
        price_per_person: req.body.price_per_person,
        pub_tra: req.body.pub_tra,
        apart_images : req.body.apart_images,
        average: req.body.average,
        rep_num: req.body.rep_num,
        host_id:req.body.host_id,
        // host_username:req.body.host_username,
        // host_img:req.body.host_img,
        // host_Image: {type: String,required: true},
        // reviews: {type: String[10],required: true},
    });
    // console.log("post")
    //console.log(req.body);
    apartments.save().then(result => {
        //console.log(result);
        res.status(201).json({
            message: 'Created an apartment',
            createdApartment : {

                bed_num: result.bed_num,
                bath_num: result.bath_num,
                type: result.type,
                room_num: result.room_num,
                liv_room: result.liv_room,
                area: result.area,
                description: result.description,
                rules: result.rules,
                max_people: result.max_people,
                wi_fi: result.wi_fi,
                cooling: result.cooling,
                heating: result.heating,
                kitchen: result.kitchen,
                tv: result.tv,
                elevator: result.elevator,
                parking: result.parking,
                min_price: result.min_price,
                title: result.title,
                date_array: result.date_array,
                lat: result.lat,
                lon: result.lon,
                address: result.address,
                price_per_person: result.price_per_person,
                pub_tra: result.pub_tra,
                // apart_Image1: req.body.apart_Image1,
                // apart_Image2: req.body.apart_Image2,
                apart_images : result.apart_images,
                average: result.average,
                rep_num: result.rep_num,
                host_id:result.host_id,
                // host_username:result.host_username,
                // host_img:result.host_img,
                _id: result._id,
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(501).json({
            error:err
        });
    });
});


router.get('/',(req,res,next) => {
    Apartment.find()
        //.select('title host_id matrix average lat lon average rep_num _id max_people bed_num min_price type date_array wi_fi kitchen room_num')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                apartments: docs.map(doc =>{
                    //console.log(doc);
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

router.get('/:apartId',(req,res,next) => {
    const id = req.params.apartId
    Apartment.findById(id)
        //.select('lat lon _id average rep_num ')
        .exec()
        .then(doc => {
            // console.log("From database",doc);
            //matrix_factor();
            // console.log("done");
            if(doc){
                res.status(200).json({
                    apartment: doc,
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




router.get('/byhost/:hostId',(req,res,next) => {
    const hostid = req.params.hostId
    Apartment.find({host_id : hostid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            
            const response = {
                count: docs.length,
                apartment: docs.map(doc =>{
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


router.get('/:people/:lat/:lon/:radius/:date_from/:date_to/:pri/:pub/:apart/:ppp/:wi_fi/:cooling/:heating/:kitchen/:tv/:parking/:elevator/:page',(req,res,next) => {
    // console.log("before");
    // console.log(req.params);
    // console.log("after");
    const lat = req.params.lat
    const lon = req.params.lon
    const peo = req.params.people
    const radius = req.params.radius
    const date_from = req.params.date_from.replace(/%20/g, " ")
    const date_to = req.params.date_to.replace(/%20/g, " ")
    const pri = req.params.pri
    const pub = req.params.pub
    const apart = req.params.apart
    const ppp = req.params.ppp
    const wi_fi = req.params.wi_fi
    const cooling = req.params.cooling
    const heating = req.params.heating
    const kitchen = req.params.kitchen
    const tv = req.params.tv
    const parking = req.params.parking
    const elevator = req.params.elevator
    const page = req.params.page
    Apartment.find( { max_people: { $gte: peo } ,wi_fi:{ $gte: wi_fi },cooling:{ $gte: cooling },heating:{ $gte: heating },kitchen:{ $gte: kitchen },elevator:{ $gte: elevator },tv:{ $gte: tv },parking:{ $gte: parking }} )
        //.select('lat lon _id max_people  average rep_num title bed_num min_price type date_array wi_fi kitchen heating cooling tv parking elevator room_num price_per_person')
        .exec()
        .then(docs => {
            // console.log("docs");
            // console.log(docs[0].date_array[0].Date_from);
            // console.log("docs length = "+docs.length);
            const result = docs.filter( (x,i) => {
                dist = distance(x.lat,x.lon,lat,lon);
                if(  dist <= radius ){
                    if(!((((pri.localeCompare("true"))==0) && (((x.type).localeCompare("private"))==0)) || (((pub.localeCompare("true"))==0) && (((x.type).localeCompare("public"))==0)) || (((apart.localeCompare("true"))==0) && (((x.type).localeCompare("apartment"))==0 )))){
                        return false;
                    }   
                    const diffTime = Math.abs(new Date(date_from).getTime() - new Date(date_to).getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(x.min_price > (peo*x.price_per_person*diffDays) ){
                        return false;
                    }
                    if(ppp!=0){
                        if(x.price_per_person>ppp){
                            return false
                        }
                    }
                    //price_per_person:{ $lte: ppp }

                    
                    for(var j=0;j<(x.date_array.length);j++){
                        // console.log(date_from)
                        // console.log(date_to)
                        from1 = new Date(date_from)
                        to1 = new Date(date_to)
                        from1.setDate(from1.getDate() + 1);
                        to1.setDate(to1.getDate() + 1);
                        from2 = new Date (x.date_array[j].Date_from);
                        to2 = new Date(x.date_array[j].Date_to)
                        // console.log(from1)
                        // console.log("from1 "+from1.toISOString().slice(0,10)+" from2 "+from2.toISOString().slice(0,10));
                        // console.log("to1 "+to1.toISOString().slice(0,10)+" to2 "+to2.toISOString().slice(0,10));
                        // console.log(from1)
                        // console.log("from2 "+from2.toISOString().slice(0,10));
                        // console.log("to2 "+to2.toISOString().slice(0,10));
                        if(from2.toISOString().slice(0,10) <= from1.toISOString().slice(0,10) && to2.toISOString().slice(0,10) >= to1.toISOString().slice(0,10) ){
                            break;
                        }
                        if(j  ==  (x.date_array.length)-1  ){
                            return false;
                        }
                    }
                    return true;
                }else{
                    return false;
                } 
            } );
            // console.log("new results");
            // console.log(result);
            
            //console.log(result.date_array);
            
            send_results = result.slice(2*(page-1),page*2)
            const response = {
                count: send_results.length,
                
                apartments: send_results.map(doc =>{
                    // console.log("doc");
                    // console.log(doc);
                    //doc[1].remove;
                    //doc.slice()
                    return{
                       doc
                       
                    }
                }),
                pages:Math.ceil(result.length/2)
            };
            res.status(200).json(response);

            // console.log("From database",doc);
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
            res.status(500).json({error:err});
        });
});

router.get('/byhost/:hostId',(req,res,next) => {
    const hostid = req.params.hostId
    Apartment.find({host_id : hostid})
        //.select('lat lon _id apart_image1')
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                apartment: docs.map(doc =>{
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

router.get('/suggested/:userid',async (req,res,next) => {
    const userid = req.params.userid
    var user_matrix= new Array(3);
    await User.find({_id : userid})
    .select('_id matrix')
    .exec()
    .then(docs =>{
        // console.log("docs = ",docs);
        user: docs.map(doc =>{
        for (let i = 0; i < doc.matrix.length; i++) {
            user_matrix[i] = doc.matrix[i];
        }  
        }) 
    })
    .catch(err => {
        console.log(err);
    });
    var suggestions_score = new Array(5);
    for (let i = 0; i < 5; i++) {
        suggestions_score[i] = 0;
    }
    var suggestions_id = new Array(5);
    await Apartment.find()
    .select('_id matrix')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            apartment: docs.map(doc =>{
                var sum = doc.matrix[0]*user_matrix[0]+doc.matrix[1]*user_matrix[1]+doc.matrix[2]*user_matrix[2];
                var min_score=-1;
                var pos=0;
                // console.log("new doc");
                // console.log("sum = ",sum);
                for(let i = 0; i < 5; i++){
                    // console.log("i= ",i," sug_score = ",suggestions_score[i]," min_score = ",min_score);
                    if(suggestions_score[i] < min_score || min_score<0){
                        pos = i;
                        min_score = suggestions_score[i];
                        // console.log("pos = ",pos);
                        
                    }
                }
                if(sum>suggestions_score[pos] || suggestions_score[pos]==0){
                    // console.log("yes");
                    suggestions_score[pos]=sum;
                    suggestions_id[pos]=doc._id;
                }
            })
        };
    })
    .catch(err => {
        console.log(err);
    });
    // console.log("sugg == ",suggestions_id[0]," , ",suggestions_id[1]," , ",suggestions_id[2]," , ",suggestions_id[3]," , ",suggestions_id[4]);
    await Apartment.find({_id: {$in: suggestions_id}})
        // .select('_id')
        .exec()
        .then(docs =>{
            // console.log("docs == ",docs);
            const response = {
                count: docs.length,
                apartment: docs.map(doc =>{
                //     console.log("sugg_id = .",suggestions_id[0],". _id =  ." ,doc._id,".");
                //  console.log(suggestions_id[0] == doc._id);
                //     //console.log((suggestions_id[0]).localeCompare(doc._id));
                //     if(suggestions_id[0] == doc._id){
                //         console.log("hi");
                        return{
                            doc
                        }
                   // }
                    
                })
               
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.patch('/:apartId',checkAuth,(req,res,next) => {
    const id = req.params.apartId;
    const updateOps = {};
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    // console.log(req.body);
    for(var propName in req.body) {
        var value = req.body[propName];
        updateOps[propName] = value;
    }
    updateOps["bed_num"]=req.body.Beds_num;
    // console.log(updateOps);
    Apartment.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message:'Apartment updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});



router.delete('/:apartId',(req,res,next) => {
    Apartment.remove({_id: req.params.apartId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Apartment deleted'
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