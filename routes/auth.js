module.exports = function() {
   var route = require('express').Router();
   var pool = require('../../config/db')();

   route.get('/login', function(req, res) {
       res.render('login/login')
   })
   route.get('/register', function(req, res) {
       res.render('register/register')
   })
//    route.post('/register', function(req, res) {
//
//     var email = req.body.username,
//         nickname = req.body.nickname
//     var user = {
//         // USER_CD : userCode,
//         EMAIL_NM : email,
//         SALT_CD : 0,
//         // PASSWORD_PW : pswd,
//         NICKNAME_NM : nickname
//         // PROVIDER_NM : "local"
//     }
//     // select 하고 email 중복일시, 가입 멈추기
//     if(req.user && req.user.NICKNAME_NM) { // 간편로그인 회원가입
//         var user_cd = req.user.USER_CD
//         pool.getConnection(function(err, conn) {
//             if(err) throw err
//
//             var updateSql = 'UPDATE user_tb SET EMAIL_NM = ? WHERE USER_CD = ?'
//             conn.query(updateSql, [email, user_cd], function(err, result, fields) {
//                 if(err) throw err
//                 else {
//                     req.login(user, function() {
//                         return req.session.save( function() {
//                             res.redirect('/welcome')
//                         })
//                     })
//                 }
//             })
//             conn.release()
//         })
//     } else { // 기존 회원가입
//         user.USER_CD = require('../config/etc/userCode').getUserCode()
//         user.PASSWORD_PW = req.body.password
//         user.PROVIDER_NM = "local"
//         var hashAndSaltPromise = function() {
//             return new Promise(function(resolve, reject) {
//                 console.log("1",user);
//                 hasher({password: user.PASSWORD_PW}, function(err, pass, salt, hash) {
//                     user.PASSWORD_PW = hash
//                     user.SALT_CD = salt
//                     resolve('first: hasher ')
//                 })
//             })
//         }
//
//         var addUserPromise = function() {
//             return new Promise(function(resolve, reject) {
//                 console.log("3");
//                 pool.getConnection(function(err, conn) {
//                     if(err) throw err
//                     var insertSql = 'INSERT INTO user_tb SET ?'
//                     conn.query(insertSql, user, function(err, result, fields) {
//                         if(err) throw err
//                     })
//                     conn.release()
//                     resolve('second: insert db user information ')
//                 })
//             })
//         }
//         hashAndSaltPromise()
//         .then(addUserPromise)
//         .then(function() {
//             req.login(user, function() {
//                 return req.session.save( function() {
//                     res.redirect('/welcome')
//                 })
//             })
//         })
//     }
// })




   return route
}
