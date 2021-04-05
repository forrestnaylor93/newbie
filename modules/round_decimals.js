// const round_decimals = (number,decimal_place) =>{
//     power_of_ten = 
//     rounded_number = Math.round(number)
// }

const round = (number, decimalPlaces) => {
    let is_negative = false;
    
    if(number < 0){is_negative = true; number = Math.abs(number)};
    //console.log(number)
    let rounded = Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
    //console.log(rounded);
    if(is_negative){rounded *= -1};

    return rounded;



}

let interval = -2e-5;

for(let i = 0; i < 7; i++){
    let rounded = round(i*interval,10)
    console.log('not rounded: ', i*interval)
    console.log('rounded: ', rounded)
}