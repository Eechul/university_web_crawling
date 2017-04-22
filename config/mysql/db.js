module.exports = function() {
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit : 100,
     host     : 'localhost',
     user     : 'root',
     password : 'onlyroot',
     database : 'mysql'
  });
  return pool;
}
