var express = require('express');
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var haksaUrl = "http://www.hs.ac.kr/kor/community/haksa_list.php"
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
var mysql = require('mysql');
var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'dongdb',
   database : 'mysql'
});
conn.connect();

var hacksaPosts = [];
var scholarship = [];

app.get('/go', function(req, res) {
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

var i = 0
request(haksaUrl, function (err, res, html) {
  console.log(++i);
  if (!err) {
      var $ = cheerio.load(html);
      $("td > a").each(function (i) {
       var data = $(this)
       //post.number=data.prev().html();
       var title=data.text();
       var link=data.attr("href");
       var post = [" ", title, "-1", link, " "]
       hacksaPosts.push(post);
      })
      var i = 0;
      var j = 0;
      var flag = 0;
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
    var sql = "DELETE FROM board_hacksa"
    conn.query(sql, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send('server error!!')
      } else {
        console.log('delete success');
      }
    })
    var sql = "INSERT INTO board_hacksa(number, title, style, link, registration_date) VALUES ?"
    conn.query(sql, [hacksaPosts], function(err, results) {
      if(err) {
        console.log(err);
      } else {
        console.log('insert success');
      }
    })
});

app.get('/', function(req, res) {
  res.render('index');
})

app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
