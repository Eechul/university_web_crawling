module.exports = function() {
  var mysql = require('mysql');
  var conn = mysql.createConnection({
     host     : 'localhost',
     user     : 'root',
     password : 'dongdb',
     database : 'mysql'
  });
  conn.connect();
  return conn;
}
