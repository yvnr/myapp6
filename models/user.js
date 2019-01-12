var mongoose = require('mongoose');
//for email
var email = require('mongoose-type-email');

var userSchema = new mongoose.Schema({

    //expert mobile No.
    mobileNo: {
        type: String,
        //required: true
    },

    //expert's area pincode
    pincode: {
        type: String,
        //required: true
    },

    //password to login
    password: {
        type: String,
        //required: true
    }
});
var user = mongoose.model("user", userSchema);
module.exports = user;

module.exports.createUser = function(newUser, cb){
    newUser.save(cb);
}

module.exports.findUserByMobileNo = function(mobileNo) {
    return user.find({mobileNo}).exec();
}