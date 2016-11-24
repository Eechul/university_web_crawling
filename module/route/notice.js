module.exports = function() {
  var route = require('express').Router();
  var conn = require('../../config/db')();

  route.get('/hacksa', function(req, res) {
    var sql = "SELECT * FROM board_hacksa ORDER BY BOARD_NO DESC"
    conn.query(sql, function(err, results) {
      if(err){
        console.log(err);
      } else {
        res.render('index', {posts:results})
      }
    })
  });

  route.get('/scholarship', function(req, res) {
    var sql = "SELECT * FROM board_scholarship ORDER BY BOARD_NO DESC"
    conn.query(sql, function(err, results) {
      if(err){
        console.log(err);
      } else {
        res.render('index', {posts:results})
      }
    })
  });

  route.get('/recruit', function(req, res) {
    var sql = "SELECT * FROM board_recruit ORDER BY BOARD_NO DESC"
    conn.query(sql, function(err, results) {
      if(err){
        console.log(err);
      } else {
        res.render('index', {posts:results})
      }
    })
  });
  return route;
}
