const nodemailer = require("nodemailer");


class MailerSingletone {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'xxxxxx@gmail.com',
                pass: 'xxxxxxxx'
            },
            tls:{
                rejectUnauthorized: false
            }
        });
        
        this.transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } 
            else {
                console.log('EMAIL SERVER READY!');
            }
        });
    }

    
    getMailAdress() {
        return 'Rage V <noreplay@ragev.de>';
    }

    isEmailValid(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email);
    }

    sendMail(message) {
        this.transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(`Error occurred. ${err.message}`);
                return process.exit(1);
            }
        });
    }

}
const mailerSingletone = new MailerSingletone();
module.exports = mailerSingletone;
