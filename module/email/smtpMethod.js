var emailAccountConfig = require('./gmailAccount')
console.log(emailAccountConfig);
module.exports = function() {
  var nodemailer = require('nodemailer');
  var smtpTransport = require("nodemailer-smtp-transport")

  var Transport = nodemailer.createTransport(smtpTransport({
      host : "smtp.gmail.com",
      secureConnection : true,
      port: 465,
      auth : {
          user : emailAccountConfig.email,
          pass : emailAccountConfig.password
      }
  }));

  return Transport;
}
