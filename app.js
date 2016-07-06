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


var posts = [];

request(haksaUrl, function (err, res, html) {
  if (!err) {
      var $ = cheerio.load(html);
      $("td > a").each(function (i) {
       var data = $(this)
       //post.number=data.prev().html();
       var title=data.text();
       var link=data.attr("href");
       var post = {
         number : " ",
         title : title,
         link : link
       }
       posts.push(post);
      })
      var j = 0;
      $("tr").each(function () {
        $(this).children('td:first-child').each(function(){
          var data = $(this)
          var number = data.text()
          if(number){
            //console.log(post.number, j);
            posts[j].number=number;
            j++;
          }
        })
      })
    }
});

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/go', function(req, res) {
  console.log(posts);
  res.render('index', {posts:posts})
});


app.listen(4003, function() {
  console.log('Connected 4003 port!!!');
})
