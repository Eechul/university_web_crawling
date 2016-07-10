var express = require('express');
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');

var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport")

var cron = require('node-schedule');
var conn = require('./config/db')();
var app = express();

var haksaUrl = "http://www.hs.ac.kr/kor/community/haksa_list.php" // 1
var scholarshipUrl = "http://www.hs.ac.kr/kor/community/scholarship_list.php" //3
var recruitUrl = "http://www.hs.ac.kr/kor/community/recruit_list.php" // 3
var urlArr = [
  haksaUrl,
  scholarshipUrl
  // recruitUrl
];

var hacksaPosts = require('./crawler/haksaCrawling')();
var scholarshipPosts = require('./crawler/scholarshipCrawling')();
// var recruitPosts = require('./crawler/recruitCrawling')();

var scholarshipCrawlingStatus;

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

var seq = 0;
var rule1 = new cron.RecurrenceRule();
rule1.second = 30;
cron.scheduleJob(rule1, function(){
    console.log(new Date(), '매 분 30초에 콜백');
    hacksaPosts.splice(0,hacksaPosts.length);
    request(urlArr[0], function (err, res, html) {
      if (!err) {
        var $ = cheerio.load(html);
        $("td > a").each(function (i) {
         var data = $(this)
         var title = data.text();
         var link = data.attr("href");
         var post = [" ", title, "-1", link, " "]
         hacksaPosts.push(post);
         return false;
        })
          $("tr").children('td:first-child').each(function(){
            var data = $(this)
            var number = data.text()
            if(number){
              hacksaPosts[0][0]=number;
              return false;
            }
          })
          $("tr").children('td:nth-child(4)').each(function(){
            var data = $(this)
            var registration_date = data.text()
            hacksaPosts[0][4] = registration_date;
            return false;
          })
      }
      var sql = "SELECT MAX(number) as number FROM board_hacksa"
      conn.query(sql, function(err, results) {
        if(err){
          console.log(err);
        } else {
          console.log(hacksaPosts[0][0], results[0].number);
          seq++;
          if(hacksaPosts[0][0] != results[0].number) {
            var sql = "INSERT INTO board_hacksa(number, title, style, link, registration_date) VALUES ?"
            conn.query(sql, [hacksaPosts], function(err, data) {
              if(err){
                console.log(err);
              } else {
                console.log(new Date(), "hacksaPost Update!!");
              }
            })
          }
        }
      })
    });
});
var rule2 = new cron.RecurrenceRule();
rule2.second = 35;
cron.scheduleJob(rule2, function(){
  var url = 'http://www.hs.ac.kr/kor/community/'
  request(urlArr[1], function (err, res, html) {
    hacksaPosts.splice(0,hacksaPosts.length);
    if (!err) {
      var $ = cheerio.load(html);
      $("td > a").each(function (i) {
       var data = $(this)
       var title = data.text();

       var link = data.attr("href");
       var post = [" ", title, "-1", link, " "]
       hacksaPosts.push(post);
       return false;
      })
        $("tr").children('td:first-child').each(function(){
          var data = $(this)
          var number = data.text()
          if(number){
            hacksaPosts[0][0]=number;
            return false;
          }
        })
        $("tr").children('td:nth-child(4)').each(function(){
          var data = $(this)
          var registration_date = data.text()
          hacksaPosts[0][4] = registration_date;
          return false;
        })
    }
    var sql = "SELECT MAX(number) as number FROM board_scholarship"
    conn.query(sql, function(err, results) {
      if(err){
        console.log(err);
      } else {
        console.log(hacksaPosts[0][0], results[0].number);
        if(hacksaPosts[0][0] != results[0].number) {
          var sql = "INSERT INTO board_scholarship(number, title, style, link, registration_date) VALUES ?"
          conn.query(sql, [hacksaPosts], function(err, data) {
            if(err){
              console.log(err);
            } else {
              console.log(new Date(), "scholarship Update!!");
              var mailOptions={
                    from : "LeeDongChel <choise154@gmail.com>",
                    to : "choise154@naver.com",
                    subject : "메일링 성공",
                    text : "Your Text",
                    html : `<h2>
                      <a href="${url+hacksaPosts[0][3]}">
                        새로운 장학공지가 업로드 되었습니다!</a>
                      </h2>`
                    // attachments : [
                    //     {   // file on disk as an attachment
                    //         filename: 'text3.txt',
                    //         path: 'Your File path' // stream this file
                    //     }
                    // ]
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log(response.response.toString());
                        console.log("Message sent: " + response.message);
                    }
                });
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
      //res.status(500).send('server error!');
    } else {
      //console.log(results);
      res.render('index', {posts:results})
    }
  })
});

app.get('/notice/scholarship', function(req, res) {
  var sql = "SELECT * FROM board_scholarship ORDER BY number DESC"
  conn.query(sql, function(err, results) {
    if(err){
      console.log(err);
      //res.status(500).send('server error!');
    } else {
      //console.log(results);
      res.render('index', {posts:results})
    }
  })
});

app.get('/notice/recruit', function(req, res) {
  var sql = "SELECT * FROM board_recruit ORDER BY number DESC"
  conn.query(sql, function(err, results) {
    if(err){
      console.log(err);
      //res.status(500).send('server error!');
    } else {
      //console.log(results);
      res.render('index', {posts:results})
    }
  })
});

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : true,
    port: 465,
    auth : {
        user : "choise154@gmail.com",
        pass : "dowklee741"
    }
}));

app.get('/test', function(req, res) {
  var mailOptions={
        from : "LeeDongChel <choise154@gmail.com>",
        to : "choise154@naver.com",
        subject : "메일링 성공",
        text : "Your Text",
        html : "<h2>성공</h2>"
        // attachments : [
        //     {   // file on disk as an attachment
        //         filename: 'text3.txt',
        //         path: 'Your File path' // stream this file
        //     }
        // ]
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
        }
    });
})

app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
