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

/* get User by Id. */
router.get('/getUsers', function (req, res) {
  db.query('select * from Users', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

/* Signup */
router.post('/signUp', function (req, res) {
  // console.log('req', req);
  var date = new Date();
  var record = {'role_id':3, 'first_name': req.body.prenom, 'last_name': req.body.nom, 'gender': req.body.genre, 'date_of_birth': req.body.dob, 'email':req.body.email, 'phone_number':req.body.phone, 'matricule': req.body.matricule, 'password': req.body.password}
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

module.exports = router;
