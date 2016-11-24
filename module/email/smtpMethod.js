
module.exports = function() {
  var nodemailer = require('nodemailer');
  var smtpTransport = require("nodemailer-smtp-transport")

  var Transport = nodemailer.createTransport(smtpTransport({
      host : "smtp.gmail.com",
      secureConnection : true,
      port: 465,
      auth : {
          user : "choise154@gmail.com",
          pass : "dowklee123@"
      }
  }));

  return Transport;
}
