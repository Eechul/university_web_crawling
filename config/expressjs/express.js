module.exports = function () {
    var express = require('express'),
        session = require('express-session'),
        MySQLStore = require('express-mysql-session')(session),
        passport = require('passport'),
        bodyParser = require('body-parser'),
        jade = require('jade'),
        app = express()


    app.use(
        session({
           secret: 'keyboard cat',
           resave: false,
           saveUninitialized: true,
           store: new MySQLStore({
               host      : 'localhost',
               user      : 'root',
               password  : 'onlyroot',
               database  : 'mysql',
               dateStrings:true
           })
       })
   )
    app.set('views', './views');
    app.set('view engine', 'jade');

    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize())
    app.use(passport.session())

   return app;
}
