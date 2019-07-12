const mongoose = require('mongoose');
const data_dokterSchema = mongoose.Schema({
    kodedokter        : {type: String, unique: true},
    namadokter 		: String,
    spesialis  	    : String,
    jamkerja 	    : String,
    hp  	        : String,
    created_at		: String
});
module.exports = mongoose.model('data_dokter', data_dokterSchema);