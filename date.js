
// console.log(module);

module.exports.getDate = getDate;

function getDate(){
let today = new Date();
    
    let option ={
        weekday: 'long',
        day: 'numeric',
        month: 'long'

    };
    let day = today.toLocaleDateString("en-US",option);
    return day;
}

// module.exports.getDay = getDay; //test 

// function getDay(){
// let today = new Date();
    
//     let option ={
//         weekday: 'long',

//     };
//     let day = today.toLocaleDateString("en-US",option);
//     return day;
// }

//mking things shorter

exports.getDay = function getDay(){
let today = new Date();
    
    let option ={
        weekday: 'long',

    };
    return today.toLocaleDateString("en-US",option);
    
}