
module.exports = function() {
  var nodemailer = require('nodemailer');
  var smtpTransport = require("nodemailer-smtp-transport")

  var smtpTransport = nodemailer.createTransport(smtpTransport({
      host : "smtp.gmail.com",
      secureConnection : true,
      port: 465,
      auth : {
          user : "****@gmail.com",
          pass : "****"
      }
  }));

  return smtpTransport;
}
