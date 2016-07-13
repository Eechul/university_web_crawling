var express = require('express');
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');
var cron = require('node-schedule');
var conn = require('./config/db')();
var smtpTransport = require('./module/email/smtpMethod')();
var app = express();

var haksaUrl = "http://www.hs.ac.kr/kor/community/haksa_list.php" // 1
var scholarshipUrl = "http://www.hs.ac.kr/kor/community/scholarship_list.php" //2
var recruitUrl = "http://www.hs.ac.kr/kor/community/recruit_list.php" // 3
var hacksaPosts = require('./crawler/haksaCrawling')();
var scholarshipPosts = require('./crawler/scholarshipCrawling')();

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
var postInfo = {
  "hacksa": {
              id: 0,
              url: haksaUrl,
              tableName: "board_hacksa",
              emailHtml: `<h1> hi, test </h2>`
            },
  "scholarship": {
                  id: 0,
                  url: haksaUrl,
                  tableName: "board_hacksa",
                  emailHtml: `<h1> hi, test </h2>`
                },
}
var hacksaPostsRule = new cron.RecurrenceRule();
hacksaPostsRule.second = 30;
cron.scheduleJob(hacksaPostsRule, function(){
    console.log(new Date(), '30초');
    require('./module/posts/postRefresh')(postInfo.hacksa);

});
var scholarshipPostsRule = new cron.RecurrenceRule();
scholarshipPostsRule.second = 40;
cron.scheduleJob(scholarshipPostsRule, function(){
    console.log(new Date(), '40초');
    require('./module/posts/postRefresh')(postInfo.scholarship);
});

var notice = require('./module/route/notice')();
app.use('/notice', notice);

app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
