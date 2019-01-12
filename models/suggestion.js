var mongoose = require('mongoose');

var suggestionSchema = new mongoose.Schema({

    //connection with query
    referenceIdQuery: {
        ref: 'query',
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
    },

    //connection with expert
    referenceIdUser: {
        ref: 'user',
        type: 'String'
        // type: mongoose.Schema.Types.ObjectId,
        //required: true
    },

    //image uploaded by expert
    filePath: [{
        type: String,
        //required: true
    }],

    answer: {
        type: String,
        //required: true
    }
    /*
        for audio files
    */
});

var suggestion = mongoose.model('suggestion', suggestionSchema);
module.exports = suggestion;

//for adding answers
module.exports.create = function(newAnswer, cb){
    newAnswer.save(cb);
}

module.exports.findAnswers = function(referenceIdQuery){
    return suggestion.find({
        referenceIdQuery
    }).exec();
}