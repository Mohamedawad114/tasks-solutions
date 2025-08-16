import nodemailer from 'nodemailer'
import  EventEmitter  from 'node:events'
import { customAlphabet } from 'nanoid'
import bcrypt from 'bcrypt'
import redis from './redis.js'

async function sendEmail({to,subject,html}){
    try{
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.APP_GMAIL,
            pass:process.env.APP_PASSWORD
        }
    })
    const Info=await transport.sendMail({
        from:process.env.APP_GMAIL,
        to:to,
        subject:subject,
        html:html
    })
}catch(err){
    console.log(err)
}
}
const emitter=new EventEmitter();
emitter.on("sendEmail",(args)=>{
    sendEmail(args)
})

const generateOTP=customAlphabet("0123456789mnbvcxzasewlkjhyuioptrqg",6)
async function generateOTPAndSend(user,email){
    const OTP =generateOTP()
    const html=`
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
  await redis.set(`otp_${email}`,OTP,"EX",2*60)
  const salt=await bcrypt.genSalt(parseInt(process.env.SALT))
  user.otps.confirmation=await bcrypt.hash(OTP,salt)
  await user.save()
  emitter.emit('sendEmail',{to:email,subject:"confirmation",html:html})
}

export default generateOTPAndSend