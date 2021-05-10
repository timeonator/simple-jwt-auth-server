var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '<host>',
  user: '<user>',
  password: '<password>',
  database: '<database>'
});
export default connection;