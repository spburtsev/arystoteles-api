import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

class EmailService {
  to: string;
  firstName: string;
  from: string;
  url: string;

  constructor(
    user: {
      name: string;
      email: string;
    },
    url: string,
  ) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Arystoteles <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(
      `${__dirname}/../static/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  public async sendWelcome() {
    await this.send('welcome', 'Welcome to the Arystoteles!');
  }

  public async sendPasswordReset() {
    await this.send(
      'password-reset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}
export default EmailService;
