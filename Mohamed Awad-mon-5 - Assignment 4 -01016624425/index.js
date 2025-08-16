const express=require('express');
const path=require('path');
const fs=require("fs");
const userFile=path.resolve('./users.json');
const app=express();
const port=3000;
app.use(express.json())
try{
app.post('/user',(req,res)=>{ ///add user
    const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
    const {name,email,age}=req.body
    const checkUser=users.find(user=>user.email===email)
    if(checkUser){
        res.status(409).json({message:"user is existed"})
    }
    else{
    const maxId= users.length ? Math.max(...users.map(u => u.id)) : 0;
        const newUser={
            id:maxId +1,
            name,
            age,
            email
        }
        users.push(newUser)
        fs.writeFileSync(userFile,JSON.stringify(users))
        res.status(201).send({message:" user added sucessfully"})
    }
})
//////////////////////////////
app.patch('/user/:id',(req,res)=>{ // update user
     const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
      const id=parseInt(req.params.id)
    const indexuser=users.findIndex(user=>user.id=== id)
    if(indexuser!=-1){
 if(req.body.email){
       const checkUser=users.find(user=>user.email===req.body.email&&user.id!==id)
       if(checkUser){
        return res.status(409).send({message:"email is already existed"})
    }}
        users[indexuser]={...users[indexuser],...req.body}
       fs.writeFileSync(userFile, JSON.stringify(users));
    res.json({ message: "User updated successfully" });
    
}
else{
        res.status(400).send({message:"user Id not found"})
    }

})
//////////////////////////
app.delete('/user{/:id}',(req,res)=>{ // delete user
     const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
      const id=parseInt(req.params.id)|| req.body.id
    const indexuser=users.findIndex(user=>user.id=== id)
    if(indexuser==-1){
         return res.status(400).send({message:"user Id not found"})
    }
       users.splice(indexuser,1)
               fs.writeFileSync(userFile, JSON.stringify(users));
    res.json({ message: "User deleted successfully" });
})
///////////////////////

////////////////////////
app.get("/user/:id",(req,res)=>{ // get user by id
    const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
    const id=parseInt(req.params.id)
    const indexuser=users.findIndex(user=>user.id=== id)
    if(indexuser!=-1){
        res.status(200).send(users[indexuser])
    }
    else{
        res.status(400).send({message:"user Id not found"})
    }
    
})
app.get("/user/:name",(req,res)=>{ /// get user by name
         const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
    const name=req.params.name
    const indexesuser=users.filter(user=>user.name===name)
    if(indexesuser.length===0){return   res.status(400).send({message:"user name not found"})}
        res.status(200).json(indexesuser) /// علطول مش محتاج  عشان filter رجعت العنر كله
})
///////////////////////////
app.get("/users/filter",(req,res)=>{// get user filter
const minAge=parseInt(req.query.minAge);
 const users=JSON.parse(fs.readFileSync(userFile,"utf-8"))
 const indexesuser=users.filter(user=>user.age>=minAge);
     if(indexesuser.length===0){return   res.status(400).send({message:"users not found"})}
        res.status(200).json(indexesuser)
})
/////////////////////////////
app.get("/users",(req,res)=>{ //get users
    res.status(200).sendFile(userFile)
})

app.options('/profile',(req,res)=>{
    res.set("avaiable",'POST ,GET, DELETE');
    res.send();
})
app.use((req,res)=>{
    res.status(404).json({message:"page not found"})
})

}
catch{
    res.status(500).send({message:"Internal server error"})
}
app.listen(port,()=>{
console.log('server is running....')
})