
// the goal of this module is to round any number tiny or huge to x decimals of percision to avoid the double floating point addition problems that happen sometime

//import Big from "big.js";


// rounds numbers less than 1e-6

get_e_index = (number_string)=>{
    let array = ( Array.from(number_string));
    //console.log(array);
    let e_index;
    array.forEach((char,index)=>{
        if(char == 'e'){
            e_index = index;
        }
    })
    return(e_index);
    
}


// num < 1e-6
round_tiny_numbers = (number, sig_figs = 3)=>{
    let number_string = number.toString();
    let e_index = get_e_index(number_string);
    let e_string = number_string.substring(e_index, number_string.length);
    let base_string = number_string.substring(0, e_index);
    let base_num = Number(base_string);
    let rounded_tiny_number = Number(Math.round(base_num*(10**sig_figs))/(10**sig_figs) + e_string)
    return rounded_tiny_number;
    

    //return 0;
    

}


// 1e-6 < num < 1
round_small_numbers = (number, sig_figs = 3)=>{
    let e = Math.floor(Math.log10(number))
    let rounded_small_number = Math.round(number * (10**(-e+sig_figs)))/10**(-e+sig_figs);
    return rounded_small_number;
} 

// 1 < num
round_bigger_than_1 = (number, sig_figs = 5) =>{
    let e = Math.floor(Math.log10(number))
    //let rounded_number = Math.floor(Math.floor(number/Math.pow(10,sig_figs-e))*Math.pow(10,sig_figs-e));
    let rounded_number = Math.round(number*Math.pow(10,1+sig_figs-e))/Math.pow(10, 1+sig_figs-e);
    rounded_number = Number(rounded_number.toPrecision(sig_figs))
    return rounded_number;
}


round = (number, decimal_places = 4)=>{

    if(Math.abs(number) < 1e-6){
        number = round_tiny_numbers(number, decimal_places)
    }
    else if(Math.abs(number) < 1){

        number = round_small_numbers(number, decimal_places)
       
    }
    else if (Math.abs(number)>=1){
       // console.log('big ol boy')
        number = round_bigger_than_1(number);
    }
    
    return number
}



show_range = ()=>{
    for(let i = -20; i < 25; i++){
        let basenum = 2.000459*(10**i) //+ 1*(10**i);
        let rounded = round(basenum);
        //console.log('normal  -  ', basenum);
        console.log(i,'  -  ', rounded);
    }
}

//round_tiny_numbers(2.0045e-8);

//let x = round_small_numbers(2*10**-5);
//console.log(x);

//show_range();

export {round};


// for (let j = -20, j < 25, j++){
//     

// }

// let rounded = round(.0001)
// console.log(rounded)


    // zooom in 
    else if(this.step.x.px > this.step.x.px_max && this.zoom_out && this.step.x.unit.e <= 200-1 && this.step.x.unit.e >= -200 + 1){
        console.log(this.step.x.unit.e);
        this.step.x.px = this.step.x.px_max;
        this.new_grid();
        switch(this.step.x.unit.number){
            case 1:
                this.step.x.unit.number *= 5;
                this.step.x.unit.e -= 1;
                this.step.x.unit.number = round(this.step.x.unit.number)
            break;
            case 2:
                this.step.x.unit.number /= 2;
                this.step.x.unit.number = round(this.step.x.unit.number)
                
            break;
            case 5:
                this.step.x.unit.number /= 2.5;
                this.step.x.unit.number = round(this.step.x.unit.number)
            break;
            default:
            

        }
    }