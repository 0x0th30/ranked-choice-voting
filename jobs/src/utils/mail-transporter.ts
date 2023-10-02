import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: '',
  port: 0,
  secure: true,
  auth: {
    user: '',
    pass: '',
  },
});
