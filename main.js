 const calculator = document.querySelector('.calculator__section')
 const keys = calculator.querySelector('.calculator__keys');
 const display = calculator.querySelector('.calculator__screen')
 
 keys.addEventListener("click", event => {
    
    if (!event.target.closest('td')) return
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
        calculator.dataset.firstNumber = displayValue
        calculator.dataset.operator = key.dataset.op
    }

    //equal sign?
    if (type==="equal"){
        //calculation
        const firstNumber = calculator.dataset.firstNumber
        const operator = calculator.dataset.operator
        const secondNumber = displayValue
        key.dataset.state = ''
        
        //calculation
        display.textContent = calculate(firstNumber, secondNumber, operator)
    }
    
    //checks whether last was a number or operator
    calculator.dataset.previousKeyType = type;
    
});





function calculate(firstNumber, secondNumber, operator){
    firstNumber = parseInt(firstNumber)
    secondNumber = parseInt(secondNumber)
    if (operator ==="plus") result= firstNumber + secondNumber
    if (operator ==="minus") result= firstNumber -  secondNumber
    if (operator ==="multiply") result= firstNumber * secondNumber
    if (operator ==="divide") {
        result= firstNumber / secondNumber
        result.toFixed(2)
    }
    return result
}