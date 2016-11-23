module.exports = function() {
  var cheerio = require('cheerio');
  var request = require('request');
  var pool = require('../config/db')();

  var recruitUrl = "http://www.hs.ac.kr/kor/community/recruit_list.php"

  var hacksaPosts = [];
  request(recruitUrl,
    function (err, res, html) {
      if (!err) {
          var $ = cheerio.load(html);
          $("td > a").each(function (i) {
           var data = $(this)
           //post.number=data.prev().html();
           var title = data.text();
           var link = data.attr("href");
           var post = [" ", title, "-1", link, " "]
           hacksaPosts.push(post);
          })
          var i = 0;
          var j = 0;
          $("tr").each(function () {
            $(this).children('td:first-child').each(function(){
              var data = $(this)
              var number = data.text()
              if(number){
                hacksaPosts[i][0]=number;
                i++;
              }
            })
            $(this).children('td:nth-child(4)').each(function(){
              var data = $(this)
              var registration_date = data.text()
              hacksaPosts[j][4] = registration_date;
              j++
            })
          })
        }
        hacksaPosts.splice(0,1);

        pool.getConnection(function(err, conn) {
            var sql = "DELETE FROM board_recruit";
            conn.query(sql, function(err, results) {
              if(err) {
                console.log(err);
              } else {
                console.log('delete success');
              }
            })
            conn.release();
        });

        pool.getConnection(function(err, conn) {
            var sql = "INSERT INTO board_recruit(number, title, style, link, registration_date) VALUES ?";
            conn.query(sql, [hacksaPosts], function(err, results) {
              if(err) {
                console.log(err);
              } else {
                console.log('insert success');
                hacksaCrawlingStatus = true;
              }
          });
        });
        conn.release();
    });
    return hacksaPosts;
};
