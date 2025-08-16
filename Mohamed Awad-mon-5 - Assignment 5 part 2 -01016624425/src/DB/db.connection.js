import mysql from 'mysql2/promise'
 const db_connection= async()=>{
     return  await mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1111',
    database:'ASSIN_5'
 })
};


 export default db_connection;