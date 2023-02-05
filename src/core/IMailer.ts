
export interface IMail {
    to:string,
    from?:string,
    subject:string,
    text?:string,
    html:string
}

export interface IMailer {
    send(mail: IMail): Promise<boolean>;
}