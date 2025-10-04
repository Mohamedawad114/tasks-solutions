import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { redis } from "./redis";
import { IEmailargument } from "../../common";
const createOTP = customAlphabet(`0123456789zxcvbnmalksjdhfgqwretruop`, 6);

async function sendEmail({ to, subject, html }:IEmailargument ) {
  try {
    const transporter = nodemailer.createTransport({
      service: `gmail`,
      auth: {
        pass: process.env.APP_PASSWORD as string,
        user: process.env.APP_GMAIL as string,
      },
      secure: true,
    });
    const Info = await transporter.sendMail({
      to: to,
      from: process.env.APP_GMAIL  as string,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}
export const emittir = new EventEmitter();
emittir.on("sendEmail", (args) => {
  sendEmail(args);
});
export const createAndSendOTP = async (email:string) => {
  const OTP = createOTP();
  const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">مرحبا بك!</h2>
            <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
            <h2 style="color: #191a1bff; text-align: center;">${OTP}</h2>
            <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
            <hr />
            <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
          </div>
        </div>
      `;
  const hashOTP = await bcrypt.hash(OTP, parseInt(process.env.SALT as string));
  await redis.set(`otp_${email}`, hashOTP, "EX", 2 * 60);
  emittir.emit("sendEmail", {
    to: email,
    subject: "confirmation Email",
    html: html,
  });
};
export const createAndSendOTP_password = async (email:string) => {
  const OTP = createOTP();
  const resetHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
    <p style="font-size: 16px; color: #555;">لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. من فضلك استخدم رمز التحقق (OTP) أدناه لإتمام العملية:</p>
    <div style="margin: 20px 0; padding: 20px; background-color: #f1f5ff; border-radius: 8px; text-align: center;">
      <h1 style="font-size: 36px; letter-spacing: 4px; color: #007BFF;">${OTP}</h1>
    </div>
    <p style="font-size: 14px; color: #777;">الرمز صالح لفترة محدودة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p> 
  </div>
</div>`;
  const hashOTP = await bcrypt.hash(OTP, parseInt(process.env.SALT as string));
  await redis.set(`otp_reset:${email}`, hashOTP, "EX", 2 * 60);
  emittir.emit("sendEmail", {
    to: email,
    subject: "reset password",
    html: resetHtml,
  });
};
// export const bannedUser_email = async (email:string) => {
//   const bannedHtml = `
// <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
//   <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
//     <h2 style="color: #d9534f;">تم حظر حسابك</h2>
//     <p style="font-size: 16px; color: #555;">
//       نود إعلامك بأنه قد تم <strong style="color:#d9534f;">حظر حسابك</strong> مؤقتًا بسبب مخالفة سياسات الاستخدام.
//     </p>
//     <p style="font-size: 16px; color: #555;">
//       إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم للمراجعة والمساعدة.
//     </p>
//     <div style="margin: 20px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px; text-align: center; border: 1px solid #ffeeba;">
//       <h3 style="color: #856404; margin: 0;">📩 تواصل معنا عبر البريد:</h3>
//       <p style="font-size: 18px; color: #333; margin: 5px 0 0 0;">
//         <a href="mailto:support@notes.com" style="color: #007BFF; text-decoration: none;">support@notes.com</a>
//       </p>
//     </div>
//     <p style="font-size: 14px; color: #777;">
//       نشكرك على تفهمك. فريق <strong>Notes</strong>.
//     </p>
//     <hr style="margin-top: 30px;" />
//     <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p>
//   </div>
// </div>
// `;
//   emittir.emit("sendEmail", {
//     to: email,
//     subject: "تم حظر حسابك",
//     html: resetHtml,
//   });
// };
