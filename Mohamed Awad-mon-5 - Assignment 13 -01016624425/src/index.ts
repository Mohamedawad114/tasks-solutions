import app from "./app";
let port=process.env.POR as string||3000;


app.listen(port,()=>{
    console.log(`port ${port} is running....`)
})