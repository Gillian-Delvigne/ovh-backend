var express = require('express');
var router = express.Router();
var db = require('../database/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* get method for fetch all categories. */
router.get('/getUsers', function (req, res) {
  db.query('select * from Users', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Login */
router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var checkEmail = "SELECT * FROM Users where email = '"+email +"' AND password = '"+ password +"'";
  db.query(checkEmail, function(error,result){
    if(error) throw error;
    // console.log(result)
    if(result.length){
      var success = {
        status: true,
        message: 'User found!!!',
        data: result
      };
      res.end(JSON.stringify(success));
    }else{
      var errors = {
        status: false,
        message: 'No user found with this email'
      };
      res.end(JSON.stringify(errors));
    }
  })
})
/* Signup */
router.post('/signUp', function (req, res) {

  var record = {'role_id':3, 'first_name': req.body.prenom, 'last_name': req.body.nom, 'gender': req.body.genre, 'date_of_birth': req.body.dob, 'email':req.body.email, 'phone_number':req.body.phone, 'matricule': req.body.matricule,
    'nationality': req.body.country, 'activity_type': req.body.typeActivity, 'activity': req.body.activity, 'general_entity': req.body.typeEntity, 'local_entity': req.body.entity, 'password': req.body.password}
  console.log(record);
  var email = req.body.email;
  var checkEmail = "SELECT * FROM Users where email = '"+email +"'";
  console.log(checkEmail);
  // Check if user exists
  db.query(checkEmail, function(error,result){
    if(error) throw error;
    // console.log(result)
    if(result.length){
      var errors = {
        status: false,
        message: 'User exists with this email'
      };
      res.end(JSON.stringify(errors));
    }else{
      db.query('INSERT INTO Users SET ?', record, function(error, result1){
        if(error) throw error;

        var getUser = "SELECT * FROM Users where user_id = '"+result1.insertId +"'";

        db.query(getUser, function(error,user){
          var datas = {
            status: true,
            data: user
          }
          res.end(JSON.stringify(datas))
        })

        // console.log('Last record insert id:', result.insertId);
      });
    }

    // console.log('Last record insert id:', result.insertId);
  });
});

// Admin APIs

/* Admin Login */
router.post('/loginAdmin', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var checkEmail = "SELECT * FROM Users where email = '"+email +"' AND password = '"+ password +"' AND role_id= '1'";
  db.query(checkEmail, function(error,result){
    if(error) throw error;
    // console.log(result)
    if(result.length){
      var success = {
        status: true,
        message: 'User found!!!',
        data: result
      };
      res.end(JSON.stringify(success));
    }else{
      var errors = {
        status: false,
        message: 'No user found with this email'
      };
      res.end(JSON.stringify(errors));
    }
  })
});

/* Users List*/
router.get('/getUsersAdmin', function (req, res) {
  db.query('select * from Users Where role_id != 1', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

// Update User
router.post('/update', function (req, res) {

  var updateQuery = "UPDATE Users SET first_name='"+req.body.first_name+"', last_name='"+req.body.last_name+"', gender='"+req.body.gender+"', date_of_birth='"+req.body.date_of_birth+"', email='"+req.body.email+"', phone_number='"+req.body.phone_number+"', matricule='"+req.body.matricule+"', nationality='"+req.body.nationality+"', activity_type="+db.escape(req.body.activity_type)+", activity="+db.escape(req.body.activity)+", general_entity="+db.escape(req.body.general_entity)+", local_entity="+db.escape(req.body.local_entity)+", password='"+req.body.password+"' WHERE user_id='"+req.body.user_id+"'";

  console.log(updateQuery);

  db.query(updateQuery, function(error, result1){
    if(error) throw error;
    console.log('results',result1);
    res.end(JSON.stringify(result1));

  });
});

/* get User by Id. */
router.get('/getUserById/:id', function (req, res) {
  var id = req.params.id;
  console.log(id)
  var selQuery = "SELECT * FROM Users WHERE user_id = '" +id+"'";
  db.query(selQuery, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Delete User by Id. */
router.post('/deleteUserById', function (req, res) {
  var id = req.body.id;
  var delQuery = "DELETE FROM Users WHERE user_id = '" +id+"'";
  console.log(delQuery);
  db.query(delQuery , function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Roles APIs */
/* get Roles. */
router.get('/getRoles', function (req, res) {
  var selQuery = "SELECT * FROM Roles";
  db.query(selQuery, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* add Roles. */
router.post('/addRoles', function (req, res) {

  var record = {'name': req.body.name}
  console.log(record);
  db.query('INSERT INTO Roles SET ?', record, function(error, result1){
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

/* Delete Role */
router.post('/deleteRole', function (req, res) {
  var id = req.body.id;
  var delQuery = "DELETE FROM Roles WHERE role_id = '" +id+"'";
  console.log(delQuery);
  db.query(delQuery , function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Edit Role */
router.post('/editRole', function (req, res) {
  console.log('req.body', req.body)


  var updateQuery = "UPDATE Roles SET name='"+req.body.name+ "' WHERE role_id='"+req.body.role_id+"'";

  console.log(updateQuery);

  db.query(updateQuery, function(error, result1){
    if(error) throw error;
    console.log('results',result1);
    res.end(JSON.stringify(result1));

  });
});

/* get Trainers. */
router.get('/getTrainers', function (req, res) {
  var selQuery = "SELECT user_id, first_name, last_name, email FROM Users WHERE role_id = 3";
  db.query(selQuery, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Status APIs */
/* get Status. */
router.get('/getStatus', function (req, res) {
    var selQuery = "SELECT * FROM Status";
    db.query(selQuery, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

/* add Status */
router.post('/addStatus', function (req, res) {

    var record = {'name': req.body.name}
    console.log(record);
    db.query('INSERT INTO Status SET ?', record, function(error, result1){
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

/* Delete Status */
router.post('/deleteStatus', function (req, res) {
    var id = req.body.id;
    var delQuery = "DELETE FROM Status WHERE status_id = '" +id+"'";
    console.log(delQuery);
    db.query(delQuery , function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

/* Edit Status */
router.post('/editStatus', function (req, res) {
    console.log('req.body', req.body)


    var updateQuery = "UPDATE Status SET name='"+req.body.name+ "' WHERE status_id='"+req.body.status_id+"'";

    console.log(updateQuery);

    db.query(updateQuery, function(error, result1){
        if(error) throw error;
        console.log('results',result1);
        res.end(JSON.stringify(result1));

    });
});

module.exports = router;
