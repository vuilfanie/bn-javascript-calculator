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
    }

    //equal sign?
    if (type==="equal"){
        //calculation
        const firstNumber = calculator.dataset.firstNumber
        const operator = calculator.dataset.operator
        const secondNumber = displayValue
        if (secondNumber.includes('.')){
            isDecimal2 = true
        }
        key.dataset.state = ''

        
        //calculation
        display.textContent = calculate(firstNumber, secondNumber, operator)
    }
    // backspace button?
    if (type==="backspace"){
        const tempNumber = displayValue.slice(0,-1);
        display.textContent = tempNumber
    }


    //checks whether last was a number or operator
    calculator.dataset.previousKeyType = type;
    
});





function calculate(firstNumber, secondNumber, operator){
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
    
    if(flag) return result.toFixed(2)
    else return result
}