const path = require('path');
const nodemailer = require('nodemailer');
const { gmail } = require('../../config/mail.json');
const { host, port, user, pass } = gmail;

const transport = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: {
    user,
    pass,
  },

  tls: {
    rejectUnauthoprized: false,
  },
});

module.exports = transport;
