const fs =require('fs');
const path=require('path');
const http=require('http')
let port=3000;
const user=path.resolve('./users.json');
function serverListiner(){
   return server.listen(port,()=>{
  console.log('server running ....')
})
}
const server=http.createServer((req,res)=>{
  try{
    const {url,method}=req;
    if(url==="/user" && method==="POST"){ ///add user
    const users =JSON.parse(fs.readFileSync(user,'utf-8'))
let data =''
    req.on("data",(chunk)=>{
    data +=chunk;
    })
    req.on("end",()=>{
      data=JSON.parse(data)
    const {email,name,age}=data;
    const check=users.find(user=>user.email===email)
    if(check){
         res.writeHead(409,{"content-type":'application/json'})
res.write(JSON.stringify({message:"Email already exists"}))
res.end() 
    }
    else{
      const maxId= users.length ? Math.max(...users.map(u => u.id)) : 0;
      const newuser={
        id: maxId +1,
        name,
        age,
        email
      }
       users.push(newuser)
       fs.writeFileSync(user,JSON.stringify(users))
      res.writeHead(201,{"content-type":'application/json'})
      res.write(JSON.stringify({message:"user added successfully"}))
      res.end()
    }
    })}
////////////////
    else if(url.startsWith('/user/') &&method==="PATCH"){ ///update with id
      const id=parseInt(url.split('/')[2])
    const users =JSON.parse(fs.readFileSync(user,'utf-8'))
let data =''
    req.on("data",(chunk)=>{
    data +=chunk;
    })
    req.on('end',()=>{
        data=JSON.parse(data)
    const {email,name,age}=data;
if(!id){
   res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "User ID is required" }));
}
const indexuser=users.findIndex(user=>user.id===id)
if(indexuser===-1){
   res.writeHead(400, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ message: "User ID is not found" }));}
    
else{
  if(name){ users[indexuser].name=name}
  if(age){ users[indexuser].age=age}
  if(email){  
    const check = users.find((u,i) => u.email === email && i !== indexuser);
    if(check){
         res.writeHead(409,{"content-type":'application/json'})
res.write(JSON.stringify({message:"Email already exists"}))
res.end() }
else{users[indexuser].email=email}
}
  fs.writeFileSync(user, JSON.stringify(users));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "User updated successfully" }));
}})}
/////////////////
else if(url.startsWith('/user/') &&method==="DELETE"){///delete user
  const id= parseInt(url.split("/")[2]);

      const users =JSON.parse(fs.readFileSync(user,'utf-8'))
        if(!id){
   res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "User ID is required" }));
}
const indexuser=users.findIndex(user=>user.id===id)
if(indexuser===-1){
   res.writeHead(400, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ message: "User ID is not found" }));}
    
else{
  users.splice(indexuser,1)
  fs.writeFileSync(user,JSON.stringify(users))
    res.writeHead(200, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ message: "User Deleted successfully" }));
}

}
   else if(url==="/user" && method==="GET"){ ///GET users
    const readstream=fs.createReadStream(user,{encoding:'utf-8',highWaterMark:1024})
    readstream.on('data',(chunk)=>{
        res.writeHead(200,{"content-type":'application/json'});
      res.write(chunk);
    })
    readstream.on('end',()=>{
      res.end()
    })
    }
else if(url.startsWith('/user/') &&method==="GET"){//get user by id
  const userid=parseInt(url.split("/")[2]);;
      const users =JSON.parse(fs.readFileSync(user,'utf-8'))
  if(!userid){
    res.writeHead(400,{"content-type":'application/json'})
    return res.end(JSON.stringify({message:"ID  is requried"}))
  }
  const indexuser=users.findIndex(user=>user.id===userid)
  if(indexuser!=-1){
    res.writeHead(200,{"content-type":'application/json'})
    res.write(JSON.stringify(users[indexuser]));
    res.end()
  }
  else{
      res.writeHead(400,{"content-type":'application/json'})
        res.end(JSON.stringify({message:"user id is not found"}));

  }
}}
catch{
  res.statusCode=500;
  res.end("Internal server error")
}

})
serverListiner()
///////////////////////////////////////////////////////////
/** node internals
 * # event loop : is the heart of Node.js. It enables non-blocking I/O by processing callbacks and managing the execution of asynchronous operations
 * 
 * # LIBUV : is a C library - that handles the event loop and I/O.
 * if the operation is non-blocking (like reading a file, network requests, DB access), Libuv handles it outside the main thread.
 * 
 * 
 * 
 *# Event Queue
 * All incoming requests are pushed to the Event Queue.
 * This queue is a FIFO (First-In-First-Out) structure.
 * Each request includes a callback function that should be executed after the operation is completed consider the response
 * 
 * callstack: Node uses it to excute sync operations.
 * 
 * callback :Once an async operation completes:
 * Its callback is placed in a queue.
 * The event loop picks it up when the main stack is empty.
 * 
 * 
 *  # thread pool : Node.js uses a thread pool (managed by Libuv) to handle CPU-intensive tasks and I/O operations. By default, it has four threads but it can be configured.
 *  !! In Node.js, the thread pool size can be adjusted using the UV_THREADPOOL_SIZE environment variable. The thread pool, provided by the libuv library, is used for tasks like file system operations, DNS lookups, and certain cryptographic functions.
 * 
 * 
 * Node.js Handles Blocking and Non-Blocking Code Execution uses a single-threaded event loop to run code. This means it can only do one thing at a time — but it handles non-blocking code smartly to stay fast and responsive.
 * 
 */