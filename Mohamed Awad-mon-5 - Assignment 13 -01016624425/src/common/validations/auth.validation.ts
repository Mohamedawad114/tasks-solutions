import z from "zod";

export const signupSchema = {
    body: z.strictObject({
        username: z.string({ error: 'username is requied and min length6' }).min(6).max(20).trim(),
        phone: z.string().length(11),
        DOB: z.date({ error: 'date of your birth required' }),
        email: z.email(),
        role: z.string().optional().default("user"),
        password:z.string().min(6).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/)
    })
}
export const loginSchema = {
    body: z.strictObject({
        email: z.email(),
          password:z.string().min(6).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/)
    })
}
export const confirmEmailSchema = {
    body: z.strictObject({
        email: z.email(),
        OTP:z.string().length(6).trim()
    })
}