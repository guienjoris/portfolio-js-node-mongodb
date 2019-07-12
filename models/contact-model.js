var mongoose= require('mongoose');
var schema = new mongoose.Schema({
    email: String,

    titlecontact: String,

    messagecontact: String
})

module.exports = mongoose.model('Contact', schema);