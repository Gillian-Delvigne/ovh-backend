var express = require('express');
var router = express.Router();
var db = require('../database/index');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* get method for fetch all Locations. */
router.get('/getLocations', function (req, res) {
    db.query('select * from Location', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

/*get method for fetch single Training Contact*/
router.get('/getLocationById/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = 'SELECT * FROM Location WHERE location_id='+id;
    db.query(sql, function(error, results, field) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    })
});
module.exports = router;
