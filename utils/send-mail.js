const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: process.env.MAIL_API,
  domain: process.env.DOMAIN_API,
});

const sendWelcomeEmail = (email, name) => {
  const data = {
    from: 'npnv.vn1@gmail.com',
    to: email,
    subject: 'Welcome to app',
    text: `Hi ${name}. Thanks for use app`,
  };

  mg.messages().send(data, (error, body) => {});
};

const sendCancelEmail = (email, name) => {
  const data = {
    from: 'npnv.vn1@gmail.com',
    to: email,
    subject: 'Goodbye bro! :(',
    text: `Hix. We feel boring when we leave`,
  };

  mg.messages().send(data, (error, body) => {});
};

const sendEmail = (email, message) => {
  const data = {
    from: 'npnv.vn1@gmail.com',
    to: email,
    subject: 'Forgot Password',
    text: message,
  };
  mg.messages().send(data, (error, body) => {});
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
  sendEmail,
};
