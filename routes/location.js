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

/*Add Location*/
router.post('/addLocation', function (req, res) {

    var record = {'name': req.body.name, 'address': req.body.address, 'email': req.body.email, 'phone_number': req.body.phone_number}
    console.log(record);
    db.query('INSERT INTO Location SET ?', record, function(error, result1){
        if(error) throw error;
        console.log(result1);
        if(result1.affectedRows == 1){
            var datas = {
                status: true,
                data: 'Record Added'
            }
        }else{
            var datas = {
                status: false,
                data: 'No Records'
            }
        }

        res.end(JSON.stringify(datas))

        // console.log('Last record insert id:', result.insertId);
    });
});

/* Edit Location*/
router.post('/editLocation', function (req, res) {

    var updateQuery = "UPDATE Location SET name='"+req.body.name+"', address='"+req.body.address+"', phone_number='"+req.body.phone_number+"', email='"+req.body.email+"' WHERE location_id='"+req.body.location_id+"'";

    console.log(updateQuery);

    db.query(updateQuery, function(error, result1){
        if(error) throw error;
        console.log('results',result1);
        res.end(JSON.stringify(result1));

    });
});

/* Delete Location*/
router.post('/deleteLocation', function (req, res) {
    var id = req.body.id;
    var delQuery = "DELETE FROM Location WHERE location_id = '" +id+"'";
    console.log(delQuery);
    db.query(delQuery , function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
module.exports = router;
