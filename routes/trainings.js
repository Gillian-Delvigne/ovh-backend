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

/* Delete Training by Id. */
router.post('/deleteTrainingById', function (req, res) {
    var id = req.body.id;
    var delQuery = "DELETE FROM Trainings WHERE training_id = '" +id+"'";
    console.log(delQuery);
    db.query(delQuery , function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

/*get method for fetching Training Contacts*/
router.get('/getTrainingsContacts', function(req, res, next) {
    var sql = 'SELECT * FROM Training_Contacts';
    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.post('/addTraining', function (req, res) {

    var record = {'name': req.body.name, 'description': req.body.description, 'duration_info': req.body.duration, 'price': req.body.price, 'participants_min':req.body.participantsMin, 'participants_max':req.body.participantsMax, 'conditions': req.body.conditions,
        'is_required': req.body.isRequired, 'category_id': req.body.categoryId, 'contact_id': req.body.trainingContactId, 'image_url': ''}
    console.log(record);
    db.query('INSERT INTO Trainings SET ?', record, function(error, result1){
        if(error) throw error;
        console.log(result1);
        // var getUser = "SELECT * FROM Users where user_id = '"+result1.insertId +"'";
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

router.post('/editTraining', function (req, res) {

    var updateQuery = "UPDATE Trainings SET name='"+req.body.name+"', description='"+req.body.description+"', duration_info='"+req.body.duration+"', price='"+req.body.price+"', participants_min='"+req.body.participantsMin+"', participants_max='"+req.body.participantsMax+"', conditions='"+req.body.conditions+"', is_required='"+req.body.isRequired+"', category_id='"+req.body.categoryId+"', contact_id='"+req.body.trainingContactId+"' WHERE training_id='"+req.body.trainingId+"'";

    console.log(updateQuery);

    db.query(updateQuery, function(error, result1){
        if(error) throw error;
        console.log('results',result1);
        res.end(JSON.stringify(result1));

    });
});

/*get method for fetch single Training Contact*/
router.get('/getTrainingContacts/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = 'SELECT * FROM Training_Contacts WHERE training_contact_id='+id;
    db.query(sql, function(error, results, field) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    })
});

/*Fetch Training Contact*/
router.get('/getTrainingContacts', function(req, res, next) {
    var id = req.params.id;
    var sql = 'SELECT * FROM Training_Contacts';
    db.query(sql, function(error, results, field) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    })
});

module.exports = router;
