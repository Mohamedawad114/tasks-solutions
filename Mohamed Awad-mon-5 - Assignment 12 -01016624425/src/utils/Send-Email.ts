import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";
import bcrypt from "bcrypt";
import redis from "./redis";
import { customAlphabet } from "nanoid";
const generateOTP = customAlphabet("0123456789mnbvwqcxasfdgoje", 6);
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
async function SendEmail({to, subject, html}:EmailOptions ) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const Info = await transporter.sendMail({
      from: process.env.APP_GMAIL as string,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}

export const emittir = new EventEmitter();
emittir.on("sendemail", (args) => {
  SendEmail(args);
});

const createAndSendOTP = async ( email:string) => {
  let OTP = generateOTP();

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">مرحبا بك!</h2>
        <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
        <h1 style="color: #007BFF; text-align: center;">${OTP}</h1>
        <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
      </div>
    </div>
  `;
  OTP = await bcrypt.hash(OTP, parseInt(process.env.SALT as string));
  await redis.set(`otp_${email}`, OTP, "EX", 2 * 60);
  emittir.emit("sendemail", { to: email, subject: "confirmation email", html });
};
export {createAndSendOTP}