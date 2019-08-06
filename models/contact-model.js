var mongoose= require('mongoose');
var schema = new mongoose.Schema({
    email: String,

    titlecontact: String,

    messagecontact: String,
    createdOn : { type:Date, default: Date.now }
})

module.exports = mongoose.model('Contact', schema);