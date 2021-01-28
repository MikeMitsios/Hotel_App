const Apartment = require('../models/apartments');
const Review = require('../models/review');
const User = require('../models/user');


module.exports = {


    matrix_factor: async function() {
        var apar_num,user_num;
        var users;
        await Apartment.find().exec()
        .then(doc1 => {
            apar_num = doc1.length;
        }).catch();

        var aparts= new Array(apar_num);
        j=0;
        await Apartment.find().exec()
        .then(doc1 => {
            const response = {
                apartments: doc1.map(doc =>{
                    aparts[j] = doc._id;
                    j++;
                    //console.log(doc._id);
                })
            };
        }).catch();
        j=0;
        await User.find().exec()
        .then(doc2 => {
            user_num = doc2.length;
        }).catch();

        var users= new Array(user_num);

        await User.find().exec()
        .then(doc1 => {
            const response = {
                user: doc1.map(doc =>{
                    users[j] = doc._id;
                    j++;

                })
            };
        }).catch();

        
        // console.log("users = ",user_num," aparts = ",apar_num);
        
        var matrix = new Array(user_num);
        for (var i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(apar_num);
        }

        for (let i = 0; i < user_num; i++) {
            for ( j = 0; j < apar_num; j++) {
                matrix[i][j] = 0;
            }
        }

        await Review.find().exec()
        .then(doc3 => {
            // console.log("From database3",doc3.length);
            const response = {
                count: doc3.length,
                apartments: doc3.map(doc =>{
                    count1 = 0;
                    count2 = 0;
                    while(true){
                        if( doc.renterid.localeCompare(users[count1])==0 ){
                            break;
                        }else{
                            count1++;
                        }
                    }
                    while(true){
                        if( doc.apartid.localeCompare(aparts[count2])==0 ){
                            break;
                        }else{
                            count2++;
                        }
                    }
                    // console.log("grade = ",doc.grade," renter = ",doc.renterid," count1 ",count1," apart = ",doc.apartid," count2 ",count2)
                    matrix[count1][count2] = parseFloat(doc.grade)*2;
                })
            };
        }).catch();
        
        // for (i = 0; i < user_num; i++) {
        //     // console.log(matrix[i][0]+" "+matrix[i][1]+" "+matrix[i][2]+" "+matrix[i][3]+" "+matrix[i][4]+" "+matrix[i][5]+" "+matrix[i][6]+" "+matrix[i][7]+" "+matrix[i][8]+" "+matrix[i][9]);
        // }


        var n = 3;//number of categories
        var user_Array = new Array(user_num);
        var user_Array_final = new Array(user_num);
        for (var i = 0; i < user_Array.length; i++) {
            user_Array[i] = new Array(n);
            user_Array_final[i] = new Array(n);
        }
        var apart_Array = new Array(apar_num);
        var apart_Array_final = new Array(apar_num);
        for (var i = 0; i < apart_Array.length; i++) {
            apart_Array[i] = new Array(n);
            apart_Array_final[i] = new Array(n);
        }
        var m=100;//number of loops
        var min_error = -1;
        for(var p = 0;p<m;p++){
            var error_sum = 0;
            for (let i = 0; i < user_num; i++) {
                for ( j = 0; j < n; j++) {
                    user_Array[i][j] = Math.floor(Math.random() * Math.floor(11));
                }
            }
            for (let i = 0; i < apar_num; i++) {
                for ( j = 0; j < n; j++) {
                    apart_Array[i][j] = Math.floor(Math.random() * Math.floor(11));
                }
            }
            for (let i = 0; i < user_num; i++) {
                for ( j = 0; j < apar_num; j++) {
                    var value = 0;
                    for(let g = 0; g<n;g++){
                        value = value + user_Array[i][g]*apart_Array[j][g]
                    }
                    if(matrix[i][j] != 0 ){
                        error_sum = error_sum + Math.abs(matrix[i][j] - value);          
                    }
                }
            }
            // console.log("error_sum = "+error_sum)
            if(error_sum < min_error || min_error<0){
                for (let i = 0; i < user_num; i++) {
                    for ( j = 0; j < n; j++) {
                        user_Array_final[i][j] = user_Array[i][j];
                    }
                }
                for (let i = 0; i < apar_num; i++) {
                    for ( j = 0; j < n; j++) {
                        apart_Array_final[i][j] = apart_Array[i][j];
                    }
                }
                //min_error = error_sum;
            }
        }
        // console.log("min_error = "+min_error)
        // console.log("USER ARRAY")
        // for (i = 0; i < user_num; i++) {
        //     console.log(user_Array[i][0]+" "+user_Array[i][1]+" "+user_Array[i][2]);
        // }
        // console.log("-----------")
        // console.log("APAR ARRAY")
        // for (i = 0; i < apar_num; i++) {
        //     console.log(apart_Array[i][0]+" "+apart_Array[i][1]+" "+apart_Array[i][2]);
        // }
        
        for(let i =0;i<user_num;i++){
            
            await User.update({_id:users[i]}, {$set: {matrix : user_Array[i]} })
            .exec()
            .catch(err => {
                console.log(err);
            });
        }
        for(let i =0;i<apar_num;i++){
            
            await Apartment.update({_id:aparts[i]}, {$set: {matrix : apart_Array[i]} })
            .exec()
            .catch(err => {
                console.log(err);
            });
        }
    },
}