const path=require('path')
function Filepath(){
    // const dir=__dirname;
    // const pathFile=path.join(__filename);
    console.log(`{File:${__filename}, Dir ${__dirname}}`)
}
Filepath();
//////////////////////////////////////
const pathFile=path.join(__filename);
function Filename(input){
    // const name=path.parse(input).basename()
    const name=path.basename(input)
    return console.log(name)
}
Filename(pathFile)
////////////////////////////////////
const path_obj={ dir: "\\folder", name: "app", ext: ".js"}
function format(input){
    const filepath=path.format(input)
 return  console.log(filepath)
}
format(path_obj)
///////////////////////////////////////////
const givenPath="/docs/readme.md";
function FileExt(input){
    const ext=path.extname(input)
    return console.log(ext);
}
FileExt(givenPath)
/////////////////////////////////////////////
const pathGiven= "/home/app/main.js"
function paresPath(input){
    const path_parse=path.parse(input);
    return console.log(`{ Name: ${path_parse.name}, Ext: ${path_parse.ext} }`)
}
paresPath(pathGiven)
//////////////////////////////////////////
const given_Path="/home/user/file.txt";
function absolutePath(input){
    return console.log(path.isAbsolute(input))
}
absolutePath(given_Path)
//////////////////////////////////////
function joinSegments(...segments) {
  return console.log(path.join(...segments));
}
joinSegments("src", "components", "App.js")
///////////////////////////////////
function resolvePAth(input){
    const resolve_path=path.resolve(__dirname,input)
    return console.log(resolve_path)
}
resolvePAth('index.js')
//////////////////////////////////////////
function joinPath(input,input2){
    const join_path=path.join(input,input2)
    return console.log(join_path)
}
joinPath("/folder1",'folder2/file.txt')
///////////////////////////////////////////
const fs=require('fs')
function rmfile(input){
    return fs.unlink(input,(error)=>{
        if(error){
            console.log("file not deleted")
        }
       

        console.log(`The ${path.basename(input)} deleted.`)
    })
}
rmfile("/path/to/data.txt")
/////////////////////////////////////////
function createfile(input){
    fs.mkdirSync(input,{recursive:true})
    console.log("sucess")
}
createfile("employee") // جرب  يرضو  out


/////////////////////////////////////////////
const eventEmitter=require('events')
const event=new eventEmitter
event.on('start',()=>{
    console.log('Welcome event triggered!')
})
event.emit('start')
/////////////////////////////////////////
function new_emp(input){
    event.on("login",()=>{
console.log(`User logged in: ${input}`)
    })
    event.emit('login')
}
new_emp('mohamed')
///////////////////////////////////////
function read(input){
    const content= fs.readFileSync(input,'utf-8')
    return console.log(`the file content => ${content}`)
}
read('./notes.txt')
/////////////////////////////////////////////////
function write(pathIn,content){
    fs.writeFile(pathIn,content,()=>{  //{flag:"a"}
        console.log("successful")
    })
}
write('./async.txt',"Async save")  //جرب out

///////////////////////////////////////////////////
function check(inputDir){
   
     if( fs.existsSync(inputDir)){
console.log(true)
     }
  
}
check("./notes.txt")

////////////////////////////////////////
const os =require('os')
function info(){
     return `{Platform: " ${os.platform()}", Arch: “${os.arch()}"}`
}
console.log(info())
///////////////////////////////////
const readpath=path.resolve(__dirname,"./big.txt")
const readStream=fs.createReadStream(readpath,{encoding:"utf-8",highWaterMark:1024})
let count=0;
readStream.on("data",(chunk)=>{
    console.log("start chunk")
    console.log(chunk)
    count++;
})
readStream.on("end",()=>{
    console.log('end stream')
    console.log(count)  // زياده
})
readStream.on('error',(er)=>{
    console.log("can't read file")
})
//////////////////////////////////////////
const destPath = path.join(__dirname,  "./dest.txt");  // هستخدم اللى قبله
const writeStream=fs.createWriteStream(destPath,{highWaterMark:1024})
readStream.on("data",(chunk)=>{
    console.log('chunk start')
writeStream.write(chunk)  //حرب out

})
readStream.on('end', () => {
  writeStream.end(); 
  console.log(' File copied using streams');
});
///////////////////////////////////
const zip=require("zlib")
const zipfile=path.resolve(__dirname,"./data.txt.gz")
const RS_zip=fs.createWriteStream(zipfile,{highWaterMark:1024})
readStream.pipe(zip.createGzip()).pipe(RS_zip)
/////////////////////////////////////////////