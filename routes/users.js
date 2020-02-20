var express = require('express');
var router = express.Router();
var db = require('../database/index');
const bcrypt = require('bcrypt');
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
  // console.log('req', req);
  var date = new Date();
  /*let passwordHash = bcrypt.hashSync(req.body.password, 10);
  console.log(passwordHash, 'hash');
  if(bcrypt.compareSync('gosolar1', passwordHash)) {
    console.log('matechjed');
  } else {
    console.log('didnt matched')
  }*/

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

/* get User by Id. */
router.get('/getUserById', function (req, res) {
  db.query('select * from Users', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

module.exports = router;
