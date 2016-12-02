var router = require('express').Router();
var pg = require('pg');
var config = require('../config/dbconfig');

var pool = new pg.Pool({
  database: config.database
});

router.post('/', function(req, res) {
  console.log('adding employee');
  var newEmployee = req.body;
  // store in DB
  pool.connect()
    .then(function(client) {
      // make query
      client.query(
        'INSERT INTO employees (first_name, last_name, job_title, employee_id_number, annual_salary) ' +
        'VALUES ($1, $2, $3, $4, $5)',
        [newEmployee.first_name, newEmployee.last_name, newEmployee.job_title, newEmployee.employee_id_number, newEmployee.annual_salary])
        .then(function(result) {
          client.release();
          res.sendStatus(201);
        })
        .catch(function(err) {
          // error
          client.release();
          console.log('error on INSERT', err);
          res.sendStatus(500);
        });
    });
});

router.get('/', function(req, res) {
  pool.connect()
    .then(function(client) {
      // make query
      client.query(
        'SELECT * FROM employees ORDER BY id ASC')
        .then(function(result) {
          client.release();
          res.send(result.rows);
        })
        .catch(function(err) {
          // error
          client.release();
          console.log('error on SELECT', err);
          res.sendStatus(500);
        });
    });
});

router.put('/:id', function(req, res) {
  pool.connect()
    .then(function(client) {
      // make query
      client.query(
        'UPDATE employees SET active = NOT active WHERE id = $1',
      [req.params.id])
        .then(function(result) {
          client.release();
          res.sendStatus(200);
        })
        .catch(function(err) {
          // error
          client.release();
          console.log('error on UPDATE', err);
          res.sendStatus(500);
        });
    });
});

module.exports = router;
