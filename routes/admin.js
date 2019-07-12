var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var RS = require ('../model/rumah_sakit')
var DR = require ('../model/data_dokter')
var RU = require ('../model/data_ruangan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/datarumah_sakit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RS.find({}, function(err, rumah_sakit) {
        //console.log(rumah_sakit);
        res.render('admin/rumah_sakit/table', { session_store: session_store, rumah_sakits: rumah_sakit })
    }).select('_id kodepasien namapasien alamat keluhan hp created_at')
});

/* GET users listing. */
router.get('/inputrumah_sakit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/rumah_sakit/input_data', { session_store: session_store})
});

//input data rumah_sakit
router.post('/inputrumah_sakit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RS.find({ kodepasien: req.body.kodepasien }, function(err, rumah_sakit) {
        if (rumah_sakit.length == 0) {
            var datarumah_sakit = new RS({
                kodepasien: req.body.kodepasien,
                namapasien: req.body.namapasien,
                alamat: req.body.alamat,
                keluhan: req.body.keluhan,
                hp: req.body.hp,
            })
            datarumah_sakit.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datarumah_sakit')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datarumah_sakit')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode pasien sudah ada....')
            res.render('admin/rumah_sakit/input_data', {
                session_store: session_store,
                kodepasien: req.body.kodepasien,
                namapasien: req.body.namapasien,
                alamat: req.body.alamat,
                keluhan: req.body.keluhan,
                hp: req.body.hp,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editrumah_sakit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RS.findOne({ _id: req.params.id }, function(err, rumah_sakit) {
        if (rumah_sakit) {
            console.log("rumah_sakitssss"+rumah_sakit);
            res.render('admin/rumah_sakit/edit_data', { session_store: session_store, rumah_sakits: rumah_sakit })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datarumah_sakit')
        }
    })
})

router.post('/:id/editrumah_sakit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RS.findById(req.params.id, function(err, rumah_sakit) {
        rumah_sakit.kodepasien = req.body.kodepasien;
        rumah_sakit.namapasien = req.body.namapasien;
        rumah_sakit.alamat = req.body.alamat;
        rumah_sakit.keluhan = req.body.keluhan;
        rumah_sakit.hp = req.body.hp;

        rumah_sakit.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datarumah_sakit');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    RS.findById(req.params.id, function(err, rumah_sakit){
        rumah_sakit.remove(function(err, rumah_sakit){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data Pasien berhasil dihapus!');
            }
            res.redirect('/datarumah_sakit');
        })
    })
})


/* GET users listing. */
router.get('/datadata_dokter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    DR.find({}, function(err, data_dokter) {
        //console.log(data_dokter);
        res.render('admin/data_dokter/table', { session_store: session_store, data_dokters: data_dokter })
    }).select('_id kodedokter namadokter spesialis jamkerja hp created_at')
});

/* GET users listing. */
router.get('/inputdata_dokter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/data_dokter/input_data', { session_store: session_store})
});

//input data rumah_sakit
router.post('/inputdata_dokter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    DR.find({ kodedokter: req.body.kodedokter }, function(err, data_dokter) {
        if (data_dokter.length == 0) {
            var datadata_dokter = new DR({
                kodedokter: req.body.kodedokter,
                namadokter: req.body.namadokter,
                spesialis: req.body.spesialis,
                jamkerja: req.body.jamkerja,
                hp: req.body.hp,
            })
            datadata_dokter.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datadata_dokter')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datadata_dokter')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode dokter sudah ada....')
            res.render('admin/data_dokter/input_data', {
                session_store: session_store,
                kodedokter: req.body.kodedokter,
                namadokter: req.body.namadokter,
                spesialis: req.body.spesialis,
                jamkerja: req.body.jamkerja,
                hp: req.body.hp,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editdata_dokter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    DR.findOne({ _id: req.params.id }, function(err, data_dokter) {
        if (data_dokter) {
            console.log("data_dokterssss"+data_dokter);
            res.render('admin/data_dokter/edit_data', { session_store: session_store, data_dokters: data_dokter })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datadata_dokter')
        }
    })
})

router.post('/:id/editdata_dokter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    DR.findById(req.params.id, function(err, data_dokter) {
        data_dokter.kodedokter = req.body.kodedokter;
        data_dokter.namadokter = req.body.namadokter;
        data_dokter.spesialis = req.body.spesialis;
        data_dokter.jamkerja = req.body.jamkerja;
        data_dokter.hp = req.body.hp;

        data_dokter.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datadata_dokter');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    DR.findById(req.params.id, function(err, data_dokter){
        data_dokter.remove(function(err, data_dokter){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data Dokter berhasil dihapus!');
            }
            res.redirect('/datadata_dokter');
        })
    })
})


/* GET users listing. */
router.get('/datadata_ruangan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RU.find({}, function(err, data_ruangan) {
        //console.log(data_ruangan);
        res.render('admin/data_ruangan/table', { session_store: session_store, data_ruangans: data_ruangan })
    }).select('_id koderuangan namaruangan status created_at')
});

/* GET users listing. */
router.get('/inputdata_ruangan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/data_ruangan/input_data', { session_store: session_store})
});

//input data data_ruangan
router.post('/inputdata_ruangan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RU.find({ koderuangan: req.body.koderuangan }, function(err, data_ruangan) {
        if (data_ruangan.length == 0) {
            var datadata_ruangan = new RU({
                koderuangan: req.body.koderuangan,
                namaruangan: req.body.namaruangan,
                status: req.body.status,
            })
            datadata_ruangan.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datadata_ruangan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datadata_ruangan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode ruangan sudah ada....')
            res.render('admin/data_ruangan/input_data', {
                session_store: session_store,
                koderuangan: req.body.koderuangan,
                namaruangan: req.body.namaruangan,
                status: req.body.status,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editdata_ruangan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RU.findOne({ _id: req.params.id }, function(err, data_ruangan) {
        if (data_ruangan) {
            console.log("data_ruanganssss"+data_ruangan);
            res.render('admin/data_ruangan/edit_data', { session_store: session_store, data_ruangans: data_ruangan })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datadata_ruangan')
        }
    })
})

router.post('/:id/editdata_ruangan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    RU.findById(req.params.id, function(err, data_ruangan) {
        data_ruangan.koderuangan = req.body.koderuangan;
        data_ruangan.namaruangan = req.body.namaruangan;
        data_ruangan.status = req.body.status;

        data_ruangan.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datadata_ruangan');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    RU.findById(req.params.id, function(err, data_ruangan){
        data_ruangan.remove(function(err, data_ruangan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data Ruangan berhasil dihapus!');
            }
            res.redirect('/datadata_ruangan');
        })
    })
})

module.exports = router;