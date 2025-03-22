import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/queues/email/email.service';

@Processor('email-queue')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async sendMail(job: Job) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { to, subject, template, context } = job.data;
    await this.emailService.processEmail(to, subject, template, context);
  }
}
