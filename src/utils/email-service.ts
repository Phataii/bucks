import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Logger from "./logger";
import EmailTemplate from "../models/email-template.model";
import { NotFoundException } from "./service-exceptions";
import ejs from "ejs";
import path from "path";

dotenv.config();

const logger = new Logger("email-service");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      logger.log("✅ Email sent", { messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error("❌ Email send error", { error });
      throw new Error("Email not sent");
    }
  }

  /**
   * Send a welcome email to new users
   * @param to - Recipient email
   * @param firstName - Recipient's first name
   */
    async sendWelcomeEmail(name: string, to: string, firstName: string) {
      const emailTemplate = await EmailTemplate.findOne({ name }).lean();
      if(!emailTemplate){
        throw new NotFoundException("error fetching email...");
      }
      const subject = emailTemplate.subject;
      const html = await ejs.render(emailTemplate.body, {
      name: firstName,
      supportEmail: "support@bucks.com",
      companyAddress: "Abuja, Nigeria"
    });

    return EmailService.sendEmail(to, subject, html);
  }

  async sendConfirmEmail(name: string, to: string, data: Record<string, any>) {
      const emailTemplate = await EmailTemplate.findOne({ name }).lean();
      if(!emailTemplate){
        throw new NotFoundException("error fetching email...");
      }
      const subject = emailTemplate.subject;
      const html = await ejs.render(emailTemplate.body, {
      name: data.name,
      otp: data.otp,
      supportEmail: "support@bucks.com",
      companyAddress: "Abuja, Nigeria"
    });

    return EmailService.sendEmail(to, subject, html);
  }

  async sendConfirmPasswordReset(name: string, to: string, data: Record<string, any>) {
      const emailTemplate = await EmailTemplate.findOne({ name }).lean();
      if(!emailTemplate){
        throw new NotFoundException("error fetching email...");
      }
      const subject = emailTemplate.subject;
      const html = await ejs.render(emailTemplate.body, {
      name: data.name,
      otp: data.otp,
      supportEmail: "support@bucks.com",
      companyAddress: "Abuja, Nigeria"
    });

    return EmailService.sendEmail(to, subject, html);
  }

  async sendLoginAlert(name: string, to: string, data: Record<string, any>) {
      const emailTemplate = await EmailTemplate.findOne({ name }).lean();
      if(!emailTemplate){
        throw new NotFoundException("error fetching email...");
      }
      const subject = emailTemplate.subject;
      const html = await ejs.render(emailTemplate.body, {
      name: data.name,
      otp: data.otp,
      supportEmail: "support@bucks.com",
      companyAddress: "Abuja, Nigeria"
    });

    return EmailService.sendEmail(to, subject, html);
  }

}
