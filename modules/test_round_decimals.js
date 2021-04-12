// const round_decimals = (number,decimal_place) =>{
//     power_of_ten = 
//     rounded_number = Math.round(number)
// 
const find_e_index = (number_string)=>{
    let index = 0;
    let e_index;
    
    let array = Array.from(number_string)
    //let index = 0;
    
    array.forEach((char, index)=>{
        if(char == 'e'){
            e_index = index;
        }
    })

    return e_index
}

const round_tiny = (num, decimal_places = 3)=>{
let rounded;
let numString;
let numString_no_e;
let e_string;
let e_index
if(Math.abs(num) < 1e-6){
    numString = num.toString()
    e_index = find_e_index(numString);
    e_string = numString.substring(e_index, numString.length)
    numString_no_e = numString.substring(0,e_index);
    numString_no_e = Math.round(Number(numString_no_e)*(10**decimal_places))/(10**decimal_places)
    rounded = Number(numString_no_e + e_string);
    return(rounded)
}
else{console.log('number too large for round tiny')}


}

const round_huge = (num, decimal_places = 3)=>{
    let rounded;
    let numString;
    let numString_no_e;
    let e_string;
    let e_index
    if(Math.abs(num) > 1e20){
        numString = num.toString()
        e_index = find_e_index(numString);
        e_string = numString.substring(e_index, numString.length)
        numString_no_e = numString.substring(0,e_index);
        numString_no_e = Math.round(Number(numString_no_e)*(10**decimal_places))/(10**decimal_places)
        rounded = Number(numString_no_e + e_string);
        return(rounded)
    }
    else{console.log('number too large for round tiny')}
    
    
    }

const round = (number, decimal_places = 6) => {
    let is_negative = false;
    let size = null;
    let rounded;
    
    
    if(number < 0){is_negative = true; number = Math.abs(number)};


    switch(true){
        case (number < 1e-6):
            rounded = round_tiny(number, decimal_places)
        break;
        case (number > 1e20):
            rounded = round_huge(number, decimal_places)
        break;
        default:
            //console.log('normal round')
            rounded = Number(Math.round(number + "e" + decimal_places) + "e-" + decimal_places);
    }

    if(is_negative){rounded *= -1};
    return rounded;

   

    //rounded = Number(Math.round(number + "e" + decimalPlaces).toFixed() + "e-" + decimalPlaces);


   
    
   

    return ;



}

//export{round};
//let num = round(2e11)
//console.log(num)
// let interval = -2e-7;

for(let i = -20; i < 25; i++){
    let basenum = 2*(10**i) //+ 1*(10**i);
    let rounded = round(basenum);
    console.log(i,'  -  ', rounded);
}

let example = round(2e15);
console.log(example);
// for (let j = -20, j < 25, j++){
//     

// }

// let rounded = round(.0001)
// console.log(rounded)
