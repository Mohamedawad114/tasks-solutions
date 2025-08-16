import db_connection from "../../../DB/db.connection.js";
const connect=await db_connection()


export const addsales=async(req,res)=>{
    try{
     const {product_id,quantitySold,saleDate}=req.body;
const insertQuery=`INSERT INTO sales (P_ID,QUANTITYSOLD,SALEDATE) VALUES (${product_id},${quantitySold},'${saleDate}')`
  const [result_insert]=await connect.execute(insertQuery)
  if(result_insert.affectedRows){
   return res.status(200).json({message:'sales added successful'})}
   return res.status(400).send("query connection failed")
    
}catch(err){
return res.status(500).send(`something wrong ,${err} `)
}}