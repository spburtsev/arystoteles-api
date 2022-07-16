import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import AppLocale from '../model/enum/AppLocale';
import { IMedic } from '../model/data/schema/Medic';
import { IScreening } from 'src/model/data/schema/Screening';
import { IChild } from 'src/model/data/schema/Child';

class EmailService {
  to: string;
  firstName: string;
  from: string;
  url: string;

  constructor(email: string, url: string) {
    this.to = email;
    this.url = url;
    this.from = `Arystoteles <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
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
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public async send(template: string, subject: string, addOptions?: object) {
    let renderOptions = {
      firstName: this.firstName,
      url: this.url,
      subject,
    };
    if (addOptions) {
      renderOptions = { ...renderOptions, ...addOptions };
    }
    const html = pug.renderFile(
      `${__dirname}/../static/email/${template}.pug`,
      renderOptions,
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

  public async sendFailureReport(file: string, msg: string) {
    await this.send('failure', 'Failure report', {
      msg,
      file,
    });
  }

  public async sendMedicConfirmationRequest(medic: IMedic) {
    await this.send('medic-confirmation-request', 'Confirm a medic account', {
      fullName: medic.user.fullName,
      email: medic.user.email,
    });
  }

  public async sendScreeningResult(screening: IScreening, child: IChild) {
    await this.send('screening-result', 'Screening result', {
      dateTime: screening.updatedAt || screening.createdAt,
      childName: child.firstName,
      childBirthDate: child.birthDate,
    });
  }
}
export default EmailService;
