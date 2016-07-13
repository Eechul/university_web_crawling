module.exports = function () {
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser')
  var cheerio = require('cheerio');
  var request = require('request');
  var cron = require('node-schedule');
  
  return app;
}
