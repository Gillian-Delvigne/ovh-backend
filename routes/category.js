var express = require('express');
var router = express.Router();
var db = require('../database/index');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* get method for fetch all categories. */
router.get('/getCategories', function (req, res) {
    db.query('select * from Category', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;
