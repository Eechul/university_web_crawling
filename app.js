var express = require('express');
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');
var cron = require('node-schedule');
var conn = require('./config/db')();
var smtpTransport = require('./module/email/smtpMethod')();
var app = express();

var postInfo = {
  "hacksa": {
              id: 0,
              url: 'http://www.hs.ac.kr/kor/community/haksa_list.php',
              tableName: "board_hacksa"
            }
  // "scholarship": {
  //                 id: 1,
  //                 url: 'http://www.hs.ac.kr/kor/community/scholarship_list.php',
  //                 tableName: "board_scholarship"
  //               },
  // "recruit": {
  //               id: 2,
  //               url: 'http://www.hs.ac.kr/kor/community/recruit_list.php',
  //               tableName: "board_recruit"
  //             },
}
// var resultHacksaPosts = require('./crawler/hanshinUnivCrawling')(postInfo.hacksa);
// var resultScholarship = require('./crawler/hanshinUnivCrawling')(postInfo.scholarship);
// var resultRecruitship = require('./crawler/hanshinUnivCrawling')(postInfo.recruit);

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// var hacksaPostsRule = new cron.RecurrenceRule();
// hacksaPostsRule.second = 30;
// cron.scheduleJob(hacksaPostsRule, function(){
//     console.log(new Date(), '30초');
//     require('./module/posts/postRefresh')(postInfo.hacksa);
//
// });
// var scholarshipPostsRule = new cron.RecurrenceRule();
// scholarshipPostsRule.second = 40;
// cron.scheduleJob(scholarshipPostsRule, function(){
//     console.log(new Date(), '40초');
//     require('./module/posts/postRefresh')(postInfo.scholarship);
// });

// var recruitPostsRule = new cron.RecurrenceRule();
// scholarshipPostsRule.second = 50;
// cron.scheduleJob(recruitPostsRule, function(){
//     console.log(new Date(), '50초');
//     require('./module/posts/postRefresh')(postInfo.recruit);
// });

app.get('/auth/login', function(req, res) {
    res.render('login/login')
})

var notice = require('./module/route/notice')();
app.use('/notice', notice);


app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
