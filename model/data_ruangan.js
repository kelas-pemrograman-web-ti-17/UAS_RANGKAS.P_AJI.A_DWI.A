const mongoose = require('mongoose');
const data_ruanganSchema = mongoose.Schema({
    koderuangan     : {type: String, unique: true},
    namaruangan 	: String,
    status  	    : String,
    created_at		: String
});
module.exports = mongoose.model('data_ruangan', data_ruanganSchema);