var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var RS = require('../model/rumah_sakit')
var DR = require('../model/data_dokter')
var RU = require('../model/data_ruangan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/datarumah_sakitmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    RS.find({}, function(err, rumah_sakit) {
        console.log(rumah_sakit);
        res.render('admin/rumah_sakit/table', { session_store: session_store, rumah_sakits: rumah_sakit })
    }).select('_id kodepasien namapasien alamat keluhan hp created_at')
});

/* GET users listing. */
router.get('/data_doktermember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    DR.find({}, function(err, data_dokter) {
        console.log(data_dokter);
        res.render('admin/data_dokter/table', { session_store: session_store, data_dokters: data_dokter })
    }).select('_id kodedokter namadokter spesialis jamkerja hp created_at')
});


/* GET users listing. */
router.get('/data_ruanganmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    RU.find({}, function(err, data_ruangan) {
        console.log(data_ruangan);
        res.render('admin/data_ruangan/table', { session_store: session_store, data_ruangans: data_ruangan })
    }).select('_id koderuangan namaruangan status created_at')
});

router.get('/home', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/home', { session_store: session_store})
});



module.exports = router;




