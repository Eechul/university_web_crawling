var cheerio = require('cheerio');
var request = require('request');
var cron = require('node-schedule');
// var conn = require('./config/db')();
var smtpTransport = require('./module/email/smtpMethod')();
var app = require('./config/expressjs/express')()

var postInfo = {
  "hacksa": {
              id: 0,
              url: 'http://www.hs.ac.kr/kor/community/haksa_list.php',
              tableName: "board_hacksa"
          },
  "scholarship": {
                  id: 1,
                  url: 'http://www.hs.ac.kr/kor/community/scholarship_list.php',
                  tableName: "board_scholarship"
                },
  "recruit": {
                id: 2,
                url: 'http://www.hs.ac.kr/kor/community/recruit_list.php',
                tableName: "board_recruit"
              }
}
require('./crawler/hanshinUnivCrawling')(postInfo.hacksa);
require('./crawler/hanshinUnivCrawling')(postInfo.scholarship);
require('./crawler/hanshinUnivCrawling')(postInfo.recruit);



var hacksaPostsRule = new cron.RecurrenceRule();
hacksaPostsRule.second = 30;
cron.scheduleJob(hacksaPostsRule, function(){
    console.log(new Date(), '30초');
    require('./module/posts/postRefresh')(postInfo.hacksa);
});
var recruitPostsRule = new cron.RecurrenceRule();
recruitPostsRule.second = 50;
cron.scheduleJob(recruitPostsRule, function(){
    console.log(new Date(), '50초');
    require('./module/posts/postRefresh')(postInfo.recruit);
});

var auth = require('./routes/auth')();
var notice = require('./routes/notice')();
app.use('/auth', auth);
app.use('/notice', notice);


app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
