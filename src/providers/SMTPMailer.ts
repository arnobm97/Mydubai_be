import { IMailer, IMail } from "../core/IMailer";
import { SMTPConf } from "../core/Config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class SMTPMailer implements IMailer {

    private mailer: Mail;

    public constructor(private smtp: SMTPConf) {
        this.mailer = nodemailer.createTransport(smtp);
    }

    public async send(mail: IMail): Promise<boolean> {
        if(!mail.from) mail.from = this.smtp.from;
        try {
            const info = await this.mailer.sendMail(mail);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}