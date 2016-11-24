module.exports = function(postInfo) {
  // var postInfo =
  //   {
  //     id: 0,
  //     url: haksaUrl,
  //     tableName: board_hacksa,
  //     emailHtml: `<h1> hi, test </h2>`
  //   }
  //
  var request = require('request');
  var cheerio = require('cheerio');
  var conn = require('../../config/db')();
  var smtpTransport = require('../email/smtpMethod')();
  var tmpPost = [];
  request(postInfo.url, function (err, res, html) {
    if (!err) {
      var $ = cheerio.load(html);
      $("td > a").each(function (i) {
       var data = $(this)
       var TITLE_NM = data.text();
       var LINK_NM = data.attr("href");
       var post = [" ", TITLE_NM, "-1", LINK_NM, " "]
       tmpPost.push(post);
       return false;
      })
        $("tr").children('td:first-child').each(function(){
          var data = $(this)
          var BOARD_NO = data.text()
          if(BOARD_NO){
            tmpPost[0][0]=BOARD_NO;
            return false;
          }
        })
        $("tr").children('td:nth-child(4)').each(function(){
          var data = $(this)
          var REGISTRATION_DATE_DT = data.text()
          tmpPost[0][4] = REGISTRATION_DATE_DT;
          return false;
        })
    }
    var sql = "SELECT MAX(BOARD_NO) as BOARD_NO FROM "+postInfo.tableName;
    conn.query(sql, function(err, results) {
      if(err){
        console.log(err);
      } else {
        if(tmpPost[0][0] != results[0].BOARD_NO) {
          var sql = "INSERT INTO "+postInfo.tableName+"(BOARD_NO, TITLE_NM, STYLE_CT, LINK_NM, REGISTRATION_DATE_DT) VALUES ?"
          conn.query(sql, [tmpPost], function(err, data) {
            if(err){
              console.log(err);
            } else {
              console.log(new Date(), postInfo.url+" Update!!");
              var mailOptions={
                    from : "LeeDongChel <choise154@gmail.com>",
                    to : "choise154@gmail.com",
                    subject : "[치.그.봐] 게시판이 업데이트 되었습니다.",
                    // text : "Your Text",
                    html : `<div>
                              <center> [치지말고.그냥.봐 - 한신대 ver] </center>
                            </div>
                            <center>
                              <h5>
                              <a href="http://www.hs.ac.kr/kor/community/${tmpPost[0][3]}">
                              ${tmpPost[0][1]}</a>
                              </h5>
                            </center>
                            <div>
                              <center> have a good day~ </center>
                            </div>
                      `
                }
                smtpTransport.sendMail(mailOptions, function(err, res){
                  if(err){
                      console.log(err);
                  }else{
                      console.log("Message sent success");
                  }
              });
            }
          })
        }
      }
    })
  });
  return  0;
}
