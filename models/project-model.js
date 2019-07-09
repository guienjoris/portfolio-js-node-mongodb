var mongoose= require('mongoose');
var schema = new mongoose.Schema({
    title: {type: String, required: true},

    author: {type: String , required:true },

    describe : {type: String  , required:true},

    image: { type: String},
    createdOn : { type:Date, default: Date.now }
})

module.exports = mongoose.model('Post', schema);