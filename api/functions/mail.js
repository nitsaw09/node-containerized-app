const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mail = mailOption => {
  const options = {
    viewEngine: {
      extname: ".hbs",
      layoutsDir: path.resolve(__dirname, "../templates/email"),
      defaultLayout: mailOption.template,
      partialsDir: path.resolve(__dirname, "../templates/email")
    },
    viewPath: path.resolve(__dirname, "../templates/email"),
    extName: ".hbs"
  };

  transporter.use("compile", hbs(options));
  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

module.exports = mail;
