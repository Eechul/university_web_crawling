module.exports = function() {
    var route = require('express').Router();
    var pool = require('../../config/mysql/db')();

route.get('/hacksa', function(req, res) {
    var sql = "SELECT * FROM board_hacksa ORDER BY BOARD_NO DESC"
    pool.getConnection( function(err, conn) {
        conn.query(sql, function(err, results) {
            if(err){
                console.log(err);
            } else {
                res.render('index', {posts:results})
            }
        })
        conn.release()
    })
});

route.get('/scholarship', function(req, res) {
    var sql = "SELECT * FROM board_scholarship ORDER BY BOARD_NO DESC"
    pool.getConnection(function(err, conn) {
        conn.query(sql, function(err, results) {
            if(err){
                console.log(err);
            } else {
                res.render('index', {posts:results})
            }
        })
        conn.release()
    })

});

route.get('/recruit', function(req, res) {
    var sql = "SELECT * FROM board_recruit ORDER BY BOARD_NO DESC"
        pool.getConnection( function(err, conn) {
            conn.query(sql, function(err, results) {
                if(err){
                    console.log(err);
                } else {
                    res.render('index', {posts:results})
                }
            })
            conn.release()
        })
});

return route;
}
