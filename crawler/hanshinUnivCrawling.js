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
              //BOARD_NO, TITLE_NM, STYLE_CT, LINK_NM, REGISTRATION_DATE_DT
           var data = $(this)
           //post.number=data.prev().html();
           var TITLE_NM = data.text();
           var LINK_NM = data.attr("href");
           var post = [" ", TITLE_NM, "-1", LINK_NM, " "]
           posts.push(post);
          })
          var i = 0;
          var j = 0;
          $("tr").each(function () {
            $(this).children('td:first-child').each(function(){
              var data = $(this)
              var BOARD_NO = data.text()
              if(BOARD_NO){
                posts[i][0]=BOARD_NO;
                i++;
              }
            })
            $(this).children('td:nth-child(4)').each(function(){
              var data = $(this)
              var REGISTRATION_DATE_DT = data.text()
              posts[j][4] = REGISTRATION_DATE_DT;
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

        var insertSql = "INSERT INTO "+postInfo.tableName+"(BOARD_NO, TITLE_NM, STYLE_CT, LINK_NM, REGISTRATION_DATE_DT) VALUES ?";
        //BOARD_NO, TITLE_NM, STYLE_CT, LINK_NM, REGISTRATION_DATE_DT
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
