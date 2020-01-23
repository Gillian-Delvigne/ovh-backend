var express = require('express');
var router = express.Router();
var db = require('../database/index');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* get method for fetch all categories. */
router.get('/getTrainingSessionByTId/:id', function (req, res) {
    var id = req.params.id;
    /*var query = 'Select ts.*,t.*, ts.training_session_id, count(p.training_session_id) as t_count from Trainings as t inner join Training_Sessions as ts ON ts.training_id=t.training_id left join Participants as p ON p.training_session_id = ts.training_session_id where t.category_id=' + id + 'group by ts.training_session_id';*/
    var query = 'SELECT * FROM Training_Sessions INNER JOIN Location ON Training_Sessions.location_id = Location.location_id AND Training_Sessions.training_id='+id;
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/* get method for Sessions Participants. */
router.get('/getTrainingSessionParticipants/:id', function (req, res) {
    var id = req.params.id;
    var query = 'SELECT * FROM Participants WHERE training_session_id='+id;
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results.length));
    });
});

router.post("/addParticipant", (req, res) => {
    // const item = req.body;
    var record = {
        user_id : req.body.userId,
        training_session_id: req.body.sessionId
    };
    console.log(record)
    db.query('INSERT INTO Participants SET ?', record, function(error, result){
        if(error) throw error;

        var datas = {
            status: true,
            data: result
        }
        res.send(JSON.stringify(datas));
    });
});

module.exports = router;
