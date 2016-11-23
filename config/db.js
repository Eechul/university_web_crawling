module.exports = function() {
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit : 100,
     host     : 'localhost',
     user     : 'root',
     password : 'dongdb',
     database : 'mysql'
  });
  return pool;
}
