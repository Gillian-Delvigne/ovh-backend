var express = require('express');
var router = express.Router();
var db = require('../database/index');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
/* get method for fetching all categories. */
router.get('/getTrainings', function (req, res) {
    db.query('select * from Trainings', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/* get method for fetching all categories joined with . */
router.get('/getTrainingsWithContacts', function (req, res) {
    db.query('SELECT * FROM Trainings INNER JOIN Training_Contacts ON Trainings.contact_id =  Training_Contacts.training_contact_id', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/*get method for fetch single Training*/
router.get('/getTrainings/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = 'SELECT * FROM Trainings WHERE training_id='+id;
    db.query(sql, function(error, results, field) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    })
});

/*get method for fetching Training by category Id*/
router.get('/getTrainingsByCat/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = 'SELECT * FROM Trainings INNER JOIN Training_Contacts ON Trainings.contact_id =  Training_Contacts.training_contact_id AND category_id='+id;
    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});


/*post method for create product*/
/*router.post('/create', function(req, res, next) {
    var name = req.body.name;
    var sku = req.body.sku;
    var price = req.body.price;

    var sql = `INSERT INTO products (name, sku, price, active, created_at) VALUES ("${name}", "${sku}", "${price}", 1, NOW())`;
    db.query(sql, function(err, result) {
        if(err) {
            res.status(500).send({ error: 'Something failed!' })
        }
        res.json({'status': 'success', id: result.insertId})
    })
});*/

/*put method for update product*/
/*router.put('/update/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var sku = req.body.sku;
    var price = req.body.price;

    var sql = `UPDATE products SET name="${name}", sku="${sku}", price="${price}" WHERE id=${id}`;
    db.query(sql, function(err, result) {
        if(err) {
            res.status(500).send({ error: 'Something failed!' })
        }
        res.json({'status': 'success'})
    })
});*/

/*delete method for delete product*/
/*router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM products WHERE id=${id}`;
    db.query(sql, function(err, result) {
        if(err) {
            res.status(500).send({ error: 'Something failed!' })
        }
        res.json({'status': 'success'})
    })
})*/
module.exports = router;
