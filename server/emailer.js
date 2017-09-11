const nodemailer = require('nodemailer');

// stored in `.env` -- never store passwords, api keys
// etc. inside source code
const {SMTP_URL} = process.env;


// `emailData` is an object that looks like this:
// {
//  from: "foo@bar.com",
//  to: "bizz@bang.com, marco@polo.com",
//  subject: "Hello world",
//  text: "Plain text content",
//  html: "<p>HTML version</p>"
// }

const sendEmail = emailData => {
  const transporter = nodemailer.createTransport(SMTP_URL);
  console.log(`Attempting to send email from ${emailData.from}`);
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
}


module.exports = {sendEmail};