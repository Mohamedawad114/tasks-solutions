import express from 'express'
import db_connection from './DB/db.connection.js';
import pro_controllor from './modules/Products/product.controllor.js'
import sup_controllor from './modules/Suppliers/suppliers.controllor.js'
import sales_controllor from './modules/Sales/sales.controllor.js'
const app=express();
let port=3000;

app.use(express.json())

app.use('/products',pro_controllor)
app.use('/suppliers',sup_controllor)
app.use('/sales',sales_controllor)






 await db_connection()
 app.use((err,req,res)=>{
    if(err){
        res.status(500).send(`something wrong ${err}`)
    }
 })

app.listen(port,()=>{
    console.log(`port ${port} is running....`)
})