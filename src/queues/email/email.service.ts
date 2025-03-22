/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApiConfigService } from '../../shared/services/api-config.service';
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ApiConfigService,
    @InjectQueue('email-queue') private mailQueue: Queue,
  ) {
    // Create a transport for sending the emails
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      host: this.configService.get('EMAIL_HOST'),
      port: +this.configService.get('EMAIL_PORT'),
      secure: true,
      pool: true,
      maxMessages: Infinity,
      maxConnections: 5,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    // Connect the transporter to the templates
    this.transporter.use(
      'compile',
      hbs({
        viewPath: join(__dirname, '..', '..', 'templates'),
        extName: '.hbs',
        viewEngine: {
          extname: '.hbs',
          partialsDir: join(__dirname, '..', '..', 'templates'),
          defaultLayout: false,
        },
      }),
    );
  }

  async sendEmail(to: string, subject: string, template: string, context: any) {
    await this.mailQueue.add(
      'send-email',
      {
        to: to,
        subject: subject,
        template: template,
        context: context,
      },
      { delay: 10000 },
    );
  }

  async processEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to,
      subject,
      template,
      context,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
