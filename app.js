var express = require('express');
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');
var cron = require('node-schedule');
var conn = require('./config/db')();
var app = express();

var haksaUrl = "http://www.hs.ac.kr/kor/community/haksa_list.php" // 1
var hacksaPosts = require('./crawler/haksaCrawling')();
var scholarshipCrawlingStatus;

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

var rule = new cron.RecurrenceRule();
rule.second = 30;
cron.scheduleJob(rule, function(){
    console.log(new Date(), '매 분 30초에 콜백');
    hacksaPosts.splice(0,hacksaPosts.length);
    //console.log(hacksaPosts);
    request(haksaUrl, function (err, res, html) {
      if (!err) {
        var $ = cheerio.load(html);
        $("td > a").each(function (i) {
         var data = $(this)
         //post.number=data.prev().html();
         var title = data.text();
         var link = data.attr("href");
         var post = [" ", title, "-1", link, " "]
         hacksaPosts.push(post);
         return false;
        })
        //$("tr").each(function () {
          $("tr").children('td:first-child').each(function(){
            var data = $(this)
            var number = data.text()
            if(number){
              hacksaPosts[0][0]=number;
              return false;
            }
          })
      //  });
        //$("tr").each(function () {
          $("tr").children('td:nth-child(4)').each(function(){
            var data = $(this)
            var registration_date = data.text()
            hacksaPosts[0][4] = registration_date;
            return false;
          })
        //})
      }
      console.log("last", hacksaPosts);
      var sql = "SELECT MAX(number) as number FROM board_hacksa"
      conn.query(sql, function(err, results) {
        if(err){
          console.log(err);
          //res.status(500).send('SELECT MAX(number) DB server error!');
        } else {
          console.log(hacksaPosts[0][0], results[0].number);
          if(hacksaPosts[0][0] != results[0].number) {
            var sql = "INSERT INTO board_hacksa(number, title, style, link, registration_date) VALUES ?"
            conn.query(sql, [hacksaPosts], function(err, data) {
              if(err){
                console.log(err);
                //res.status(500).send('INSERT DB server error!');
              } else {
                console.log(new Date(), "hacksaPost Update!!");
              }
            })
          }
        }
      })
    });
});
app.get('/notice/hacksa', function(req, res) {
  var sql = "SELECT * FROM board_hacksa ORDER BY number DESC"
  conn.query(sql, function(err, results) {
    if(err){
      console.log(err);
      res.status(500).send('server error!');
    } else {
      //console.log(results);
      res.render('index', {posts:results})
    }
  })
});

app.get('/', function(req, res) {
  res.render('index');
})

app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
