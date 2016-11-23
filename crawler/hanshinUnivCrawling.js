module.exports = function(postInfo) {
  var cheerio = require('cheerio');
  var request = require('request');
  var pool = require('../config/db')();

  var posts = [];
  request(postInfo.url,
    function (err, res, html) {
      if (!err) {
          var $ = cheerio.load(html);
          $("td > a").each(function (i) {
           var data = $(this)
           //post.number=data.prev().html();
           var title = data.text();
           var link = data.attr("href");
           var post = [" ", title, "-1", link, " "]
           posts.push(post);
          })
          var i = 0;
          var j = 0;
          $("tr").each(function () {
            $(this).children('td:first-child').each(function(){
              var data = $(this)
              var number = data.text()
              if(number){
                posts[i][0]=number;
                i++;
              }
            })
            $(this).children('td:nth-child(4)').each(function(){
              var data = $(this)
              var registration_date = data.text()
              posts[j][4] = registration_date;
              j++;
            });
        });
        }
        posts.splice(0,1);
        var deleteSql = "DELETE FROM "+postInfo.tableName;
        pool.getConnection(function(err, conn) {
            conn.query(deleteSql, function(err, results) {
              if(err) {
                  console.log("11");
                console.log(err);
              } else {
                console.log(postInfo.tableName+' delete success');
              }
          });
            conn.release();
        });

        var insertSql = "INSERT INTO "+postInfo.tableName+"(number, title, style,link, registration_date) VALUES ?";
        pool.getConnection(function(err, conn) {
            conn.query(insertSql, [posts], function(err, results) {
              if(err) {
                console.log(err);
              } else {
                console.log(postInfo.tableName+' insert success');
              }
          });
            conn.release();
        });
    });

  return ;
};
