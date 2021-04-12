import { round } from "./round_decimals";
import {Big} from './big.js'



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

const round_huge = (num)=>{
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
        numString_no_e = Math.round(Number(numString_no_e)*1000)/1000
        rounded = Number(numString_no_e + e_string);
        return(rounded)
    }
    else{console.log('number too large for round tiny')}
    
    
    }

