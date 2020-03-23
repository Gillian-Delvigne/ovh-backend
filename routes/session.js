var express = require('express');
var router = express.Router();
var db = require('../database/index');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* get method for fetching all Training Sessions. */
router.get('/getTrainingSessions', function (req, res) {
    var query = 'SELECT p.name as name,\n' +
        '    p.description as description,\n' +
        '    p.duration_info,\n' +
        '    p.price,\n' +
        '    p.participants_max as participants_max,\n' +
        '    p.participants_min as participants_min,\n' +
        '    p.contact_id,\n' +
        '    p.category_id as category_id,\n' +
        '    Training_Sessions.training_id AS training_id,\n' +
        '    Training_Sessions.day1,\n' +
        '    Training_Sessions.start_time1,\n' +
        '    Training_Sessions.start_time2,\n' +
        '    Training_Sessions.end_time1,\n' +
        '    Training_Sessions.end_time2,\n' +
        '    Training_Sessions.trainer1_id,\n' +
        '    Training_Sessions.trainer2_id,\n' +
        '    Training_Sessions.location_id,\n' +
        '    Training_Sessions.training_session_id AS training_session_id FROM Training_Sessions JOIN Trainings as p ON Training_Sessions.training_session_id = p.training_id';
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/* get method for fetching all Training Sessions By Training Id. */
router.get('/getTrainingSessionByTId/:id', function (req, res) {
    var id = req.params.id;
    console.log('id', id);
    /*var query = 'Select ts.*,t.*, ts.training_session_id, count(p.training_session_id) as t_count from Trainings as t inner join Training_Sessions as ts ON ts.training_id=t.training_id left join Participants as p ON p.training_session_id = ts.training_session_id where t.category_id=' + id + 'group by ts.training_session_id';*/
    var query = 'SELECT *, Trainings.name as training_name, Location.name as loc_name FROM Training_Sessions INNER JOIN Location ON Training_Sessions.location_id = Location.location_id INNER JOIN Trainings ON Training_Sessions.training_id = Trainings.training_id AND Training_Sessions.training_id='+id;
    let data = [];
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        var pending = results.length;
        if(pending){
            let count = 0;
            results.forEach(element => {
                // console.log('ele 1', element, element.training_session_id);
                var queryP = 'SELECT COUNT(*) as count FROM Participants WHERE training_session_id ='+element.training_session_id;
                db.query(queryP, function (err, ress, field) {
                    if (err) throw err;
                    console.log('2',ress[0])
                    element['count']= ress[0];
                    data.push(element);
                    // console.log(count, pending, data);
                    count++;
                    if(count == pending){
                        console.log('asd',data)
                        var succ = {
                            status: true,
                            message: 'Session Found!!!',
                            data: data
                        };
                        res.end(JSON.stringify(succ));
                        // res.send(JSON.stringify(data));
                    }

                })
            });
        }else{
            var errors = {
                status: false,
                message: 'No Session Found!!!'
            };
            res.end(JSON.stringify(errors));
        }

        // if(count == pending){
        //     console.log('asd',data)
        // }
        // res.send(JSON.stringify(results));
        //
    });
});

/* get method for fetching Training Session By Id. */
router.get('/getTrainingSessionByTSId/:id', function (req, res) {
    var id = req.params.id;
    var query = 'SELECT *, Trainings.name as training_name, Location.name as loc_name FROM Training_Sessions ' +
        'INNER JOIN Location ON Training_Sessions.location_id = Location.location_id ' +
        'INNER JOIN Trainings ON Training_Sessions.training_id = Trainings.training_id ' +
        'WHERE Training_Sessions.training_session_id='+id;
    let data = [];
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        // console.log(results)training_session_id
        var pending = results.length;
        let count = 0;
        results.forEach(element => {
            // console.log('ele 1', element, element.training_session_id);
            var queryP = 'SELECT COUNT(*) as count FROM Participants WHERE training_session_id ='+element.training_session_id;
            db.query(queryP, function (err, ress, field) {
                if (err) throw err;
                console.log('2',ress[0])
                element['count']= ress[0];
                data.push(element);
                // console.log(count, pending, data);
                count++;
                if(count == pending){
                    console.log('asd',data)
                    res.send(JSON.stringify(data));
                }

            })
        });
        // if(count == pending){
        //     console.log('asd',data)
        // }
        // res.send(JSON.stringify(results));
        //
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
        training_session_id: req.body.sessionId,
        status_id: '1'
    };
    console.log(record);
    const quer = 'SELECT * FROM training.Participants WHERE user_id = '+ req.body.userId +' AND training_session_id = '+req.body.sessionId;
    console.log(quer)
    db.query(quer, function(err,result1){
        if(err) throw err;
        // console.log(result)
        if(result1.length){
            var success = {
                status: false,
                message: 'Already Joined'
            };
            res.end(JSON.stringify(success));
        }else{
            db.query('INSERT INTO Participants SET ?', record, function(error, result){
                if(error) throw error;

                var datas = {
                    status: true,
                    data: result
                }
                res.send(JSON.stringify(datas));
            });
            /*var errors = {
                status: false,
                message: 'No user found with this email'
            };
            res.end(JSON.stringify(errors));*/
        }
    })
});

router.get("/getParticipants", (req, res) => {
    const dbQuery = 'SELECT  Participants.*, Training_Sessions.*, Users.first_name, Users.last_name, Users.email, Users.phone_number, Trainings.* FROM Participants LEFT JOIN Users ON Participants.user_id = Users.user_id JOIN Training_Sessions ON Participants.training_session_id = Training_Sessions.training_session_id JOIN Trainings ON Training_Sessions.training_id = Trainings.training_id WHERE Participants.status_id = 1 AND Users.user_id IS NOT NULL';

    db.query(dbQuery, function(error, result){
        if(error) throw error;

        var datas = {
            status: true,
            data: result
        }
        res.send(JSON.stringify(datas));
    });
});

/* get method for fetching all Training Sessions By Training Id. */
router.get('/getTrainingSessionByAll', function (req, res) {
    var query = 'SELECT * FROM `Training_Sessions` JOIN Trainings ON Training_Sessions.training_id = Trainings.training_id';
    db.query(query, function(error, result){
        if(error) throw error;

        var datas = {
            status: true,
            data: result
        }
        res.send(JSON.stringify(datas));
    });
});

// Add Session
router.post('/addTrainingSession', function (req, res) {

    var record = {'day1': req.body.day1, 'start_time1': req.body.start_time1, 'end_time1': req.body.end_time1, 'day2': req.body.day2 ? req.body.day2 : null, 'start_time2':req.body.start_time2, 'end_time2':req.body.end_time2, 'training_id': req.body.training_id,
        'trainer1_id': req.body.trainer1_id, 'trainer2_id': req.body.trainer2_id ? Number(req.body.trainer2_id) : null, 'location_id': req.body.location_id ? Number(req.body.location_id) : null}
    console.log(record);
    db.query('INSERT INTO Training_Sessions SET ?', record, function(error, result1){
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

/* Delete Session */
router.post('/deleteSession', function (req, res) {
    var id = req.body.id;
    var delQuery = "DELETE FROM Training_Sessions WHERE training_session_id = '" +id+"'";
    console.log(delQuery);
    db.query(delQuery , function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

/* Edit Session */
router.post('/editSession', function (req, res) {
    console.log('req.body', req.body)
    var day2 = req.body.day2 ? req.body.day2 : null;
    var trainer2_id = req.body.trainer2_id ? Number(req.body.trainer2_id) : null;
    var location_id = req.body.location_id ? Number(req.body.location_id) : null;

    var updateQuery = "UPDATE Training_Sessions SET day1='"+req.body.day1+"', start_time1='"+req.body.start_time1+"', end_time1='"+req.body.end_time1+"', day2="+day2+", start_time2='"+req.body.start_time2+"', end_time2='"+req.body.end_time2+"', training_id='"+req.body.training_id+"', trainer1_id='"+req.body.trainer1_id+"', trainer2_id="+trainer2_id+", location_id="+location_id+" WHERE training_session_id='"+req.body.training_session_id+"'";

    console.log(updateQuery);

    db.query(updateQuery, function(error, result1){
        if(error) throw error;
        console.log('results',result1);
        res.end(JSON.stringify(result1));

    });
});

module.exports = router;
