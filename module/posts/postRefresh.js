var Promise = require('promise');
module.exports = function(postInfo) {

  var request = require('request');
  var cheerio = require('cheerio');
  var pool = require('../../config/mysql/db')();
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
    var selectSql = "SELECT MAX(BOARD_NO) as BOARD_NO FROM "+postInfo.tableName;
        var selectPost = function() {
            return new Promise(function(resolve, reject) {
                pool.getConnection(function(err, conn) {
                    conn.query(selectSql, function(err, results) {
                      if(err) reject(err);
                      else {
                          console.log("results[0].BOARD_NO (1-1) :", results[0].BOARD_NO);
                          conn.release();
                          resolve(results);
                      }
                    })
                })
            })
        }

        var insertPost = function(results) {
            return new Promise(function(resolve, reject) {
                console.log("insertPostFn tmpPost[0][0] (1) :", tmpPost[0][0]);
                if(tmpPost[0][0] != results[0].BOARD_NO) {
                    console.log("insertPostFn results[0].BOARD_NO (2) :", results[0].BOARD_NO);
                    var insertSql = "INSERT INTO "+postInfo.tableName+"(BOARD_NO, TITLE_NM, STYLE_CT, LINK_NM, REGISTRATION_DATE_DT) VALUES ?"
                    pool.getConnection(function(err, conn) {
                        conn.query(insertSql, [tmpPost], function(err, data) {
                            if(err) reject(err)
                            else {
                                conn.release();
                                resolve("최신 게시글 등록")
                            }
                        })
                    })

                } else {
                    resolve("최신 게시글 미등록")
                }
            })
        }
        // conn.release()

        var sendMail = function() {
            return new Promise(function(resolve, reject) {
                console.log(new Date(), postInfo.url+" Update!!");
                // 메일 승인한 [사람들] 에게 전송
                // 모듈화
                var mailOptions={
                      from : "LeeDongChel <choise154@gmail.com>",
                      to : "choise154@gmail.com",
                      subject : "[게시판 알리미]게시판이 업데이트 되었습니다.",
                      html : `<div>
                                <center> [게시판 알리미 - 한신대 ver] </center>
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
                    if(err) reject(err)
                    else {
                        console.log("Message sent success");
                        resolve(true)
                    }
                });
            })

              // --- 여러사람들에게 보낼수 있게 모듈화

        }
        selectPost()
        .then(function(result) { console.log("1"); return insertPost(result) })
        .catch(function(err) { console.log("2-1");  throw err })
        // .then(function(result) { console.log("3");  return sendMail() })
        // .catch(function(err) { console.log("2-2");  throw err })
        // .then(function(result) { console.log("4"); })


  });
  return  0;
}
