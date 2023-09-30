const nodeMailer=require("nodemailer");
const dotenv=require("dotenv")

const sendEmail=async(options)=>{
    console.log(process.env.SMTP_SERVICE)
    const transporter=nodeMailer.createTransport({
        
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        secure: true,
        secureConnection: false,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        },
        tls:{
            rejectUnAuthorized:true
        }

    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
      };

      await transporter.sendMail(mailOptions);
};

module.exports=sendEmail;