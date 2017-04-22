module.exports = function(app) {
    var pool = require('../db/mysql').pool
    var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy
    var FacebookStrategy = require('passport-facebook').Strategy;
    var NaverStrategy = require('passport-naver').Strategy;
    KakaoStrategy = require('passport-kakao').Strategy;

    var hasher = require('../hasher/pbkfd2_password')()


    passport.serializeUser(function(user, done) {
        console.log("serializeUser", "시리얼라이즈유저");
        done(null, user.USER_CD);
    })
    passport.deserializeUser(function(id, done) {
        pool.getConnection(function(err, conn) {
            var selectSql = 'SELECT * FROM user_tb'
            conn.query(selectSql, function(err, users, fields) {
                for(var i =0; i<users.length; i++) {
                    var user = users[i]
                    if(user.USER_CD === id) {
                        console.log("deserializeUser", "디시리얼라이즈유저");
                        done(null, user);
                    }
                }
            })

            conn.release()
        })

    })
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username,
                pwd = password
            // 전체 유저의 아이디 비교해서
            // 같으면, 유저정보에서 salt 가져와서 입력한 pwd와 암호화하고
            // 그 결과가 유저정보의 pwd(hash)값과 같으면 로그인 성공
            pool.getConnection(function(err, conn) {
                var selectSql = 'SELECT * FROM user_tb WHERE EMAIL_NM = ?'
                conn.query(selectSql, uname, function(err, users, fields) {
                    var user = users[0]
                    if(err) throw err // 쿼리문 에러 출력
                    else if(!user){ // user 존재하지 않을때,
                        done(null, false);
                    } else { // user 존재할때
                        return hasher({password: pwd, salt:user.SALT_CD}, function(err, pass, salt, hash) {
                            if(hash == user.PASSWORD_PW) {
                                console.log('5');
                                done(null, user)
                            } else {
                                console.log('6');
                                done(null, false)
                            }
                        })
                    }
                })
                conn.release()
            })
        }
    ))

    passport.use(new FacebookStrategy({
        clientID: "184229931975831",
        clientSecret: "a7bd585609e6f42f289a45ad9e8671da",
        callbackURL: "http://localhost:4002/auth/facebook/callback",
        profileFields: ['displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        var userInfo = profile._json
        var userSet = {
            USER_CD : userInfo.id,
            EMAIL_NM : userInfo.email, // 맞는지 확인해야함
            SALT_CD : 0,
            PASSWORD_PW : 0,
            NICKNAME_NM : userInfo.name,
            PROVIDER_NM : "facebook"
            // salt 와 pwd 부분은 어떻게 처리해야할까?
        }
        pool.getConnection(function(err, conn) {
            console.log("1");
            var selectSql = 'SELECT * FROM user_tb WHERE USER_CD = ?'
            conn.query(selectSql, userSet.USER_CD, function(err, users, fields) {
                console.log("2");
                var user = users[0]
                if(err) throw err
                else if(!user) {
                    var insertSql = 'INSERT INTO user_tb SET ?'
                    conn.query(insertSql, userSet, function(err, result, fields) {
                        console.log("3");
                        if(err) throw err
                        else {
                            done(null, user)
                        }
                    })
                } else {
                    done(null, user)
                }
            })
            conn.release()
        })



        // 밑의 설계는 일단 보류, 일단 기본적인 간편로그인을 구현하자

        // 하고자 하는것은 퍼미션에서는 email을 받고는 있지만
        // 사용자는 이 eamil을 우리에게 안 줄수 있는 권한이 존재한다
        // 따라서 간편로그인 버튼 클릭 -> 로그인성공 구도가 아닌
        // 간편로그인 버튼 클릭 -> 회원가입(이메일 추가입력) -> 로그인성공 구도로 감

        // 1. id 값만 DB 와 비교한다
        // 2. 값이 존재한다면, done 함수를 통해 successRedirect로 넘어간다.
        // 2-1.id값이 존재한다는 것은, 회원가입 직전까지 간 경우 1)와
        // 회원가입을 마친 경우 2)가 존재한다

        // 2-1-1) 직전까지 간 경우는 user 테이블에 email = null 일때이다
        // 이때는 회원가입 폼에서 submit 하게 만든다

        // 2-1-2) 회원가입을 마친 경우는 1)과 반대로  user 테이블에 email != null 이다
        // 간편로그인을 실시하면 된다.
    }));

    passport.use(new NaverStrategy({
        clientID: "GvmEwcSqYZ8AuUO75JQ8",
        clientSecret: "BshH2i6wpf",
        callbackURL: "http://localhost:4002/auth/naver/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        var userInfo = profile._json
        console.log(userInfo);
        var userSet = {
            USER_CD : userInfo.id,
            EMAIL_NM : userInfo.email,
            SALT_CD : null,
            PASSWORD_PW : null,
            NICKNAME_NM : userInfo.nickname,
            PROVIDER_NM : "naver"
        }
        pool.getConnection(function(err, conn) {
            console.log("1");
            var selectSql = 'SELECT * FROM user_tb WHERE USER_CD = ?'
            conn.query(selectSql, userSet.USER_CD, function(err, users, fields) {
                console.log("2");
                var user = users[0]
                console.log(user);
                if(err) throw err
                else if(!user) {
                    var insertSql = 'INSERT INTO user_tb SET ?'
                    conn.query(insertSql, userSet, function(err, result, fields) {
                        console.log("3");
                        if(err) throw err
                        else {
                            done(null, user)
                        }
                    })
                } else {
                    done(null, user)
                }
            })
            conn.release()
        })
    }
))
    passport.use(new KakaoStrategy({
        clientID : "fb005eccecbcc77eecb28d48953e545c",
        callbackURL : "http://localhost:4002/auth/kakao/callback"
      },
      function(accessToken, refreshToken, profile, done) {
          var userInfo = profile._json
          console.log(userInfo);
          var userSet = {
              USER_CD : userInfo.id,
            //   EMAIL_NM : userInfo.email,
              SALT_CD : null,
              PASSWORD_PW : null,
              NICKNAME_NM : userInfo.properties.nickname,
              PROVIDER_NM : "kakao"
          }
          pool.getConnection(function(err, conn) {
              console.log("1");
              var selectSql = 'SELECT * FROM user_tb WHERE USER_CD = ?'
              conn.query(selectSql, userSet.USER_CD, function(err, users, fields) {
                  console.log("2");
                  var user = users[0]
                  console.log(user);
                  if(err) throw err
                  else if(!user) {
                      var insertSql = 'INSERT INTO user_tb SET ?'
                      conn.query(insertSql, userSet, function(err, result, fields) {
                          console.log("3");
                          if(err) throw err
                          else {
                              done(null, user)
                          }
                      })
                  } else {
                      done(null, user)
                  }
              })
              conn.release()
          })
      }
))

    return passport
}
