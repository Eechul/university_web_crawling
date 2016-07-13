
module.exports = function() {
  var nodemailer = require('nodemailer');
  var smtpTransport = require("nodemailer-smtp-transport")

  var smtpTransport = nodemailer.createTransport(smtpTransport({
      host : "smtp.gmail.com",
      secureConnection : true,
      port: 465,
      auth : {
          user : "choise154@gmail.com",
          pass : "dowklee741"
      }
  }));

  return smtpTransport;
}
