import db_connection from "../../../DB/db.connection.js";
const connect=await db_connection()


export const addsupplier=async(req,res)=>{
    try{
     const {name,number}=req.body;
const insertQuery=`INSERT INTO suppliers (S_NAME,CONTACT_NUMBER) VALUES ('${name}','${number}')`
  const [result_insert]=await connect.execute(insertQuery)
  if(result_insert.affectedRows){
   return res.status(200).json({message:'supplier added successful'})}
   return res.status(400).send("query connection failed")
    
}catch(err){
return res.status(500).send(`something wrong ,${err} `)
}}