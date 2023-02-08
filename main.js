 const calculator = document.querySelector('.calculator__app')
 const keys = calculator.querySelector('.calculator__btn');
 const display = calculator.querySelector('.calculator__display')
 let isDecimal1 = false
 let isDecimal2 = false

 keys.addEventListener("click", event => {
    
    if (!event.target.closest('span')) return
    const key = event.target;
    const keyValue = key.textContent.trim();
    const displayValue = display.textContent.trim();
    const type = key.dataset.type
    const previousKeyType = calculator.dataset.previousKeyType
   

    //? clear button
    if (type == "clear"){ 
        display.textContent = '0';
        key.dataset.state = ''
    }
    //condition to check if its a number
    if (type === 'number'){
        if (displayValue === '0'){
            display.textContent = keyValue;
        }else if(previousKeyType==='operator'){
            display.textContent = keyValue;
        }
        else{
            display.textContent = displayValue+keyValue;
        }
    }
   
    //operator?
    if (type === "operator"){
        //allow only one operator at a time
        const currentActiveOperator = calculator.querySelector('[data-state="selected"]')
        if (currentActiveOperator){
            currentActiveOperator.dataset.state =''
        }
        key.dataset.state = 'selected'

        //stores operator and firstNumber
        if(displayValue.includes('.')){
            isDecimal1 =true
        }
        calculator.dataset.firstNumber = displayValue
        calculator.dataset.operator = key.dataset.op
        display.textContent = ""
    }

    //equal sign?
    if (type==="equal"){
        //calculation
        const firstNumber = calculator.dataset.firstNumber
        const operator = calculator.dataset.operator
        const secondNumber = displayValue
        if (secondNumber != "" && firstNumber !="0"){
            if (operator==='divide' && secondNumber==='0'){
                display.textContent='Seriously?'
            }
            else{
                if (secondNumber.includes('.')){
                    isDecimal2 = true
                }
                key.dataset.state = ''
            
                        
                //calculation
                display.textContent = calculate(firstNumber, secondNumber, operator, key)
            }  
        }else{
            display.textContent="Invalid operation"
        }
        
    }
    // backspace button?
    if (type==="backspace"){
        const tempNumber = displayValue.slice(0,-1);
        display.textContent = tempNumber
    }


    //checks whether last was a number or operator
    calculator.dataset.previousKeyType = type;
    
});





function calculate(firstNumber, secondNumber, operator, key){
    let result = 0
    let flag = false
    //checks whether a decimal number or integer
    
    if (isDecimal1 || isDecimal2) {
        firstNumber = parseFloat(firstNumber)
        secondNumber = parseFloat(secondNumber)
        isDecimal1 = false
        isDecimal2 = false
        flag= true
    }else{
        firstNumber = parseInt(firstNumber)
        secondNumber = parseInt(secondNumber)
    }
    if (operator ==="plus") result= firstNumber + secondNumber
    if (operator ==="minus") result= firstNumber -  secondNumber
    if (operator ==="multiply") result= firstNumber * secondNumber
    if (operator ==="divide") result= firstNumber / secondNumber
    if(flag){
            return result.toFixed(2)
        }
    else{
        return result
    }

}

  

// code to look at

// // Create and initialize variables
// class Calculator {
//     constructor() {
//       this.curVal = null;
//       this.secVal = null;
//       this.dispVal = null;
//       this.history = [];
//       this.operator = null;
//       this.prevOperator = null;
//       this.reset = false;
//       this.percentage = false;
//     }
  
//     // Parse values passed into the calculator and return float with 15 decimal places.
//     parse(val) {
//       return parseFloat(val.toFixed(15));
//     }
  
//     // Perform calculation
//     doCalc(op, curVal, secVal, operator = null) {
//       const calculation = {
//         "+": (curVal, secVal) => this.parse(curVal + secVal),
//         "-": (curVal, secVal) => this.parse(curVal - secVal),
//         x: (curVal, secVal) => this.parse(curVal * secVal),
//         "÷": (curVal, secVal) => this.parse(curVal / secVal),

//       };
  
//       return operator
//         ? calculation[op](parseFloat(curVal), parseFloat(secVal), operator)
//         : calculation[op](parseFloat(curVal), parseFloat(secVal));
//     }
  
//     // set display value to the value passed in and then returns the value.
//     dispatch(val) {
//       this.dispVal = val;
//       return val;
//     }
  
//     // set history array to the value passed
//     dispatchHistory(val) {
//       return (this.history = val ? [...this.history, val] : []);
//     }
  
//     //updates the history display to the value passed 
//     //check if value passed is greater than 0, 
//     // and if it is, it joins all of the values 
//     //in the array into a string. 
//     // If it is not, it sets the display to an empty string.
//     updateHistory(val) {
//       document.querySelector(".calculator__history").innerHTML =
//         val.length > 0 ? val.join(" ") : "&nbsp;";
//     }
  
//     // reset calculator to origin
//     resetCalculator() {
//       this.curVal = null;
//       this.secVal = null;
//       this.operator = null;
//       this.prevOperator = null;
//       this.percentage = null;
//       this.dispVal = null;
//       this.history = [];
//       this.reset = false; // Resetting secVal to null
//     }
  
//     // check if value passed is less than or equal to 23
//     allowInput(val) {
//       return String(val).length <= 23;
//     }
  
//     // checks if the value passed in contains a period
//     allowPeriod(val) {
//       return String(val).indexOf(".") !== -1;
//     }
  
//     // main function "process" 
//     process(val) {
//       if (val >= 0 || val <= 9 || val === ".") {
//         if (!this.curVal && val === ".") {
//           return 0;
//         }
  
//         if (this.operator === "=") {
//           this.resetCalculator();
//         }
  
//         // store first input value
//         if (!this.operator) {
//           if (this.curVal && !this.allowInput(this.curVal)) {
//             return this.dispatch(this.curVal);
//           }
//           // check if period is allowed
//           if (val === "." && this.allowPeriod(this.curVal)) {
//             return this.dispatch(this.curVal);
//           }
  
//           this.curVal ? (this.curVal += val) : (this.curVal = val);
//           this.dispatch(this.curVal);
//           // store second input value
//         } else {
//           if (this.secVal && !this.allowInput(this.secVal)) {
//             return this.dispatch(this.secVal);
//           }
//           // check if period is allowed
//           if (val === "." && this.allowPeriod(this.secVal)) {
//             return this.dispatch(this.secVal);
//           }
  
//           !this.secVal || this.reset ? (this.secVal = val) : (this.secVal += val);
  
//           this.dispatch(this.secVal);
//           // cancel second value reset flag
//           this.reset = false;
//         }
//       } else if (val === "+" || val === "-" || val === "x" || val === "÷") {
//         // Initiate second value reset
//         if (this.operator === "=") {
//           this.operator = val;
//           this.reset = true;
//         }
//         // If both values present, perform calculation
//         else if (this.curVal && this.secVal) {
//           this.curVal = this.dispatch(
//             this.doCalc(this.operator, this.curVal, this.secVal)
//           );
//           this.reset = true;
//         } else if (!this.curVal) {
//           this.curVal = 0;
//         }
  
//         // history update
//         if (this.curVal && !this.secVal) {
//           this.dispatchHistory(this.curVal);
//           this.dispatchHistory(val);
//           this.updateHistory(this.history);
//         } else if (this.secVal) {
//           this.dispatchHistory(this.secVal);
//           this.dispatchHistory(val);
//           this.updateHistory(this.history);
//         }
  
//         this.prevOperator = null;
//         this.operator = val;
  
  
//         // assignment opertaion
//       } else if (val === "=") {
//         if (!this.curVal && !this.secVal) {
//           return this.dispVal || 0;
//         }
  
//         // store previous operator
//         this.prevOperator = this.prevOperator ? this.prevOperator : this.operator;
  
//         if (this.secVal) {
          
//           // Continue calculation with previous operator
//           // if assignment operator is pressed
//           if (val === this.operator) {
//             this.curVal = this.dispatch(
//               this.doCalc(this.prevOperator, this.curVal, this.secVal)
//             );
//           } else {
//             // perform new calculation and assignment
//             this.curVal = this.dispatch(
//               this.doCalc(this.operator, this.curVal, this.secVal)
//             );
//             this.operator = val;
//             this.dispatchHistory(false);
//             this.updateHistory(this.history);
//           }
  
//           // if second value was not entered, compute with curVal
//         } else if (!this.secVal && this.operator) {
//           this.secVal = this.curVal;
//           this.curVal = this.dispatch(
//             this.doCalc(this.operator, this.curVal, this.secVal)
//           );
//           this.operator = val;
//         }
  
//         // set negative/positive
//       } else if (val === "+/-") {
//         if (
//           (this.curVal && !this.secVal) ||
//           (this.curVal && this.operator === "=")
//         ) {
//           this.curVal =
//             parseFloat(this.curVal) > 0
//               ? -Math.abs(this.curVal)
//               : Math.abs(this.curVal);
//           this.dispatch(this.curVal);
//         } else {
//           this.secVal =
//             parseFloat(this.secVal) > 0
//               ? -Math.abs(this.secVal)
//               : Math.abs(this.secVal);
//           this.dispatch(this.secVal);
//         }
//       } else if (val === "C") {
//         this.resetCalculator();
//         this.updateHistory(this.history);
//       }
//       console.log(this);
//       return this.dispVal || 0;
//     }
//   }
  
//   (function() {
//     const state = {};
//     const init = () => {
//       if (!state.calculator) {
//         state.calculator = new Calculator();
//       }
//     };
  
//     init();
  
//     const getInput = val => {
//       updateDisplay(state.calculator.process(val));
//     };
  
//     const updateDisplay = val => {
//       document.querySelector(".calculator__display").innerText = val;
//     };
  
//     const els = Array.from(document.querySelectorAll(".calculator__btn"));
//     els.forEach(el =>
//       el.addEventListener("click", e => {
//         const val = e.target.innerText;
//         getInput(val);
//       })
//     )
