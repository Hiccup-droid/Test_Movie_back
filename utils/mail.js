import sgMail from "@sendgrid/mail";

export const sendMail = async ({from, to, subject, text}) => {
    const msg = {
        to,
        from,
        subject,
        text
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.log('Error sending email: ', error);
    }
}