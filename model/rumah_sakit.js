const mongoose = require('mongoose');
const rumah_sakitsSchema = mongoose.Schema({
    kodepasien        : {type: String, unique: true},
    namapasien 		: String,
    alamat  	    : String,
    keluhan 	    : String,
    hp  	        : String,
    created_at		: String
});
module.exports = mongoose.model('rumah_sakit', rumah_sakitsSchema);