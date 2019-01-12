var mongoose = require('mongoose');

var querySchema = new mongoose.Schema({

    //connection with farmer
    mobileNo: {
        ref: 'user',
        type: String,
        //required: true
    },

    //image uploaded by farmer
    filePath: [{
        type: String,
        //required: true
    }],

    /*
        for audio files
    */

    //tag selected by farmer
    // tag: {
    //     type: String,
        //required: false
    // },

    //to identify whether answered or not
    answerNumber: {
        type: Number,
        //required: true,
        //default: 0
    },

    //for local submissions
     pincode: {
        type: String,
     },

    //general query
    question: {
        type: String,
        
    }  

}, {
    timestamps: true
});

var query = mongoose.model('query', querySchema);
module.exports = query;

module.exports.create = function(newQuery, cb){
    newQuery.save(cb);
}

//for finding his queries by user
module.exports.getPrivateQuery = function(mobileNo){
    return query.find({
        mobileNo
    }).exec();
}

//for finding all queries by user
module.exports.getPublicQuery = function(pincode){
    return query.find({
        pincode
    }).exec();
}

module.exports.updateNumberOfAnswers = function(_id){
    return query.find({
        _id
    }).exec();
}

// module.exports.findByObjectId = function(_id){
//     return query.find({
//         _id
//     }).exec();
// }