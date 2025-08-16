let input ="123";
let res=+input+7;
console.log(res);
////////////////////////////////////////////////////
let input2 =""||0;
if(!input2){
console.log (input2==false?"Invalid":"Valid")}
///////////////////////////////////////
for(let i=1;i<=10;i+=2){
    console.log(i)
}
/////////////////////////////////////////////////
let arr1=[1,2,3,4,5,8,6,71,54]
 let arr2=arr1.filter(((ele)=> {
     return ele%2==0;
}));
for (const ele of arr2) {
    console.log(ele)
}
//////////////////////////////////////////////////
let arr3=[1,5,8,3];
let arr4=[2,5,9,10,16];
function merage(arr,arr2){
    return [...arr,...arr2]
}
console.log(merage(arr3,arr4))
//////////////////////////////////////
let num =2;
switch (num){
    case 1:
        console.log("sunday")
        break;
    case 2:
        console.log("monday")
        break;
    case 3:
        console.log("tuesday")
        break;
    case 4:
        console.log("wednesday")
        break;
    case 5:
        console.log("thursday")
        break;
    case 6:
        console.log("friday")
        break;
    case 7:
        console.log("saturday")
        break;
        default:
            console.log("invalid number day")  
}
//////////////////////////////////////
let arr_str=["mo","abc","seven","route"]
let result=arr_str.map((ele)=>{
    return ele.length;
})
console.log(result)
////////////////////////////
function division(number){
   console.log( number%3==0 && number%5==0?"Divisible by both":"not divisable")
}
division(45);
///////////////////////////////////
function squrenum(num){
console.log(num * num) //Math.pow(num)
}
squrenum(15);
///////////////////////////////
const person={
    name:"mohamed",
    age:20,
    job:"engineering"
}
function format ({name,age,job}){
console.log(`${name} is ${age} years old,he is ${job}`)
}
format(person);
////////////////////////////////////
function sum(a,b,c,d,l){
    console.log(a+b+c+d+l)
}
sum(25,45,22,10,2)
/////////////////////////


/*let promise=new Promise(function(resolve,rejecte){ 
  if(res){
    resolve();
  }
  else{
    rejecte();
  }
})
promise.then(()=>
    setTimeout(()=>{  console.log("sucess")},2000)
    
)
promise.catch(()=>{
    console.log("faileed")
})*/
async function success() {
    return new Promise((resolve)=>{
        setTimeout(()=>{
        resolve("success")},1000)
    })
    
};
success().then((res)=>{
    console.log(res)
})



//////////////////////////////
let arr5=[55,52,36,998,1258];
function max(...arr){
    console.log(Math.max(...arr))
}
max(...arr5);
///////////////////////////
function arr(obj){
    console.log(Object.keys(obj));
    // for(const key in obj){
    //     console.log( key);
    // }
}
arr(person);
///////////////////////////////////////
let str="I am always on the top";
let arr6=str.split(" ")
console.log(arr6)
//////////////////////