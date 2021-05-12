import express from "express";

var mysql = require('mysql');
const bcrypt = require('bcrypt');
import connection from './connection'
const cors = require('cors')

const corsOptions = {
//  origin: 'http://localhost:3000'
}
connection.connect();
const app = express();
app.use(express.json());
app.use(express.urlencoded());

const PORT=3001

app.listen(PORT, () => {
    console.log(`Begin listening on port:${PORT}`);
});

app.get('/password/:pw', cors(corsOptions), (req, res) => {
    const saltRounds = 10;
    const myPlaintextPassword = req.params.pw;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        res.send(hash);
    });
});
app.put('/password/:id/:pw', cors(corsOptions), (req,res)=>{
    const saltRounds = 10;
    const myPlaintextPassword = req.params.pw;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        const query = `update users set users.password=? where users.id=?`;
        console.log(query,[hash,req.params.id]);
        connection.query(query, [hash, req.params.id], (error, results, fields) => {
            if (error){
                res.end();
                return console.error(error.message);
            }  
            console.log('Updated ', results);
            res.end();
        });
    });
});


app.get('/users',  (req, res) => {
    const query = "SELECT * FROM users";
    connection.query(query, function (err, result, fields) {
        if (err) throw err
        console.log("Query Result: ", JSON.stringify(result));
        res.send(JSON.stringify(result));
    });
});

app.get('/user/:email', cors(corsOptions), function (req, res, next) {
    let query=`SELECT * FROM users where email=?`;

    console.log("Query params: ", JSON.stringify(req.params));
    connection.query(query, [req.params.email,req.params.password],  function (err, result, fields) {
        if (err) throw err
        console.log("Query Result: ", JSON.stringify(result));
        res.send(JSON.stringify(result));
    });
  });

  app.get('/username/:username', cors(corsOptions), function (req, res, next) {
    let query=`SELECT * FROM users where username=?`;
    console.log("Query params: ", JSON.stringify(req.params));
    connection.query(query, [req.params.username,req.params.password],  function (err, result, fields) {
        if (err) throw err
        console.log("Query Result: ", JSON.stringify(result));
        res.send(JSON.stringify(result));
    });
  });

  app.post('/user',  function(req, res) {
      let query=`insert into users set users.email = ?, users.password=?`;
    
      console.log("Request Body: ", req.body);
      connection.query(query,[req.body.email,req.body.password], function(err, result, fields) {
          if (err) throw err;
          res.send(JSON.stringify(result));
      });

  });
  
// app.get('/user/:id:email', (req, res, next) => {
//     console.log(JSON.stringify(req.params));
//     res.send(JSON.stringify(req.param));
// });

app.post('/user:index', (req, res) => {
    console.log(`post to /user port ${PORT}`);
});

app.post('/register/:first_name/:last_name/:email/:username', (req, res) => {
    let sql = `INSERT INTO users(first_name, last_name, email, username) VALUES( ?, ?, ?, ?)`;
    let p = req.params;
    // console.log(p);
    let params = [p.first_name, p.last_name, p.email, p.username];
    console.log("params: ", params)
    connection.query(sql, [p.first_name,p.last_name,p.email,p.username], (error, results, fields) => {
      if (error){
        return console.error(error.message);
        res.end();
      }  
      console.log('Added Row(s) from Users:', results.affectedRows);
      res.end();
    });
});

app.delete('/user/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE users.id = ?`;
    connection.query(sql, Number(req.params.id), (error, results, fields) => {
      if (error)
        return console.error(error.message);
        
      console.log('Deleted Row(s) from Users:', results.affectedRows);
      res.end();
    });
});