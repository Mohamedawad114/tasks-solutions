import app from "./app";
import env from 'dotenv'
env.config()
const port=process.env.port ||3000




app.listen(port,()=>{
console.log(`server is running on ${port}`)
})