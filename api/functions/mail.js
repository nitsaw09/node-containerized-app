const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD
  }
});

const mail = mailOption => {
  const templateDir = path.resolve(__dirname, "../templates/email");
  const options = {
    viewEngine: {
      extname: ".hbs",
      layoutsDir: templateDir,
      defaultLayout: mailOption.template,
      partialsDir: templateDir
    },
    viewPath: templateDir,
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
