import db_connection from "../../../DB/db.connection.js";
const connect=await db_connection()

export const insertproduct=async(req,res)=>{
    try{
     const {Pname,price,stock,supplierID}=req.body;
const insertQuery=`INSERT INTO products (P_NAME,PRICE,STOCK,SUPPLIER_ID) VALUES ('${Pname}',${price},${stock},${supplierID})`
  const [result_insert]=await  connect.execute(insertQuery)
  if(result_insert.affectedRows){
   return res.status(200).json({message:'product added successful'})}
   return res.status(400).send("query connection failed")
    
}catch(err){
return res.status(500).send(`something wrong ,${err} `)
}}