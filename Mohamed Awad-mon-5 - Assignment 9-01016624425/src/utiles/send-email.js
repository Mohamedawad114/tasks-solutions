import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { EventEmitter } from "node:events";
import redis from "./redis.js";
import { customAlphabet } from "nanoid";
const generateOTP = customAlphabet("0123456789mnbvwqcxasfdgoje", 6);
const salt = await bcrypt.genSalt(10);

async function SendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const Info = await transporter.sendMail({
      from: process.env.APP_GMAIL,
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

const createAndSendOTP = async (User, email) => {
  const OTP = generateOTP();
  const html = `
  <div style="font-family: 'Cairo', sans-serif; background-color: #e6f7ff; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
<img src="https://i.postimg.cc/nzQwGcXc/dental-logo.png" alt="Dental Clinic Logo" style="max-width: 100px;" />
        <h2 style="color: #007BFF; margin-top: 10px;"></h2>
      </div>
      <p style="font-size: 16px; color: #333;">مرحباً بك 👋،</p>
      <p style="font-size: 16px; color: #333;"></p>
      <p style="font-size: 16px; color: #333;">رمز التفعيل الخاص بك هو:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #007BFF; color: #fff; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">${OTP}</span>
      </div>
      <p style="font-size: 16px; color: #333;">يرجى إدخال هذا الرمز في التطبيق لتأكيد حسابك.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999;">إذا لم تطلب هذا الكود، يمكنك تجاهل هذه الرسالة بأمان.</p>
    </div>
  </div>
`;

  await redis.set(`otp_${email}`, OTP, "EX", 60 * 2);
  User.otps.confirmation = await bcrypt.hash(OTP, salt);
  await User.save();
  emittir.emit("sendemail", { to: email, subject: "confirmation email", html });
};
const createAndSendOTP_Password = async (User, email) => {
  const OTP = generateOTP();
  const resetHtml = `
  <div style="font-family: 'Cairo', sans-serif; padding: 20px; background-color: #e6f2ff;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      
      <div style="text-align: center;">
        <img src="https://i.imgur.com/2nCt3Sbl.png" alt="Dental Clinic" style="width: 80px; margin-bottom: 20px;" />
      </div>

      <h2 style="color: #004080; text-align: center;">طلب إعادة تعيين كلمة المرور</h2>

      <p style="font-size: 16px; color: #444; text-align: center;">
        تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك في <strong>/strong>.
        الرجاء استخدام رمز التحقق (OTP) التالي لإتمام العملية:
      </p>

      <div style="margin: 30px 0; padding: 20px; background-color: #f1f8ff; border-left: 6px solid #007BFF; border-radius: 8px; text-align: center;">
        <h1 style="font-size: 38px; letter-spacing: 5px; color: #007BFF;">${OTP}</h1>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center;">
        الرمز صالح لفترة محدودة فقط. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © 2025جميع الحقوق محفوظة
      </p>
    </div>
  </div>
`;

  await redis.set(`otp_${email}`, OTP, "EX", 60 * 10);
  User.otps.reset = await bcrypt.hash(OTP, salt);
  await User.save();
  emittir.emit("sendemail", {
    to: email,
    subject: "Reset Password",
    html: resetHtml,
  });
};


export {
  SendEmail,
  createAndSendOTP,
  createAndSendOTP_Password,

};
