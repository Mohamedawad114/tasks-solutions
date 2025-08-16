/*
for Each used in loop in array only ,can't use break in this
for..of used in string,array,set ,can use break;



TDZ is The time between hoisting of let/const and their actual initialization
var => can be redeclare , not respect block scope like let,const
 */

/*ex:*/
 if (true ){
var x =10;
}
console.log(x); // output 10;
 if (true){
    let i=10;
 }
console.log(i); //ReferenceError
/*

try{..... code can have error}
catch{having solving to this error}

try- catcb=h: use to error handling  comes from user with not break.


== (equality operator) but === (strict equality operator)
 (==)  type coercion that converted to same type before the comparsion (value only)
 (====) no type coercion (value and same type) no converted to same type

 coercion تحويل الداتا تلقائى عن طريق ال javacript من غير دوال زى (==)
 conversion convert the data type  manual by me uses faunctions
 
*/
/*Ex*/
let str="152"
console.log(typeof(Number(str)))

/*Ex*/
let num=10-"5"
///////////////////////////////



























