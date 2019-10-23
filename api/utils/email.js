import { createTransport } from 'nodemailer';


export const sendMail = async (type, recipient, confHash) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'qindersurprise@gmail.com',
      pass: 'Qinder123456!'
    }
  });

  const subject = {
    'register': 'Confirm your hypeetube account',
    'reset': 'Reset your hypeetube password',
    'updateMail': 'Update your hypeetube mail',
  }

  const text = {
    'register': `${(process.env.NODE_ENV === "prod" ? process.env.URL_PROD : process.env.URL_DEV)}/activate/confirmAccount/${recipient}/${confHash}`,
    'reset': `${(process.env.NODE_ENV === "prod" ? process.env.URL_PROD : process.env.URL_DEV)}/activate/resetPassword/${recipient}/${confHash}`,
    'updateMail': `${(process.env.NODE_ENV === "prod" ? process.env.URL_PROD : process.env.URL_DEV)}/activate/updateMail/${recipient}/${confHash}`,
  }

  await transporter.sendMail({
    from: `"${type} @Hightube" <no-reply@hightube.cf>`,
    to: recipient,
    subject: subject[type],
    text: text[type]
  });
};