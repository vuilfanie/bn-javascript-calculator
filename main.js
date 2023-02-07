function add(num1, num2) {
    return num1 + num2;
  }
  
  function subtract(num1, num2) {
    return num1 - num2;
  }
  
  function multiply(num1, num2) {
    return num1 * num2;
  }
  
  function divide(num1, num2) {
    return num2 === 0 ? "Can't divide by zero!" : num1 / num2;
  }
  
  function operate(operator, num1, num2) {
    switch (operator) {
      case "+":
        return add(num1, num2);
      case "-":
        return subtract(num1, num2);
      case "*":
        return multiply(num1, num2);
      case "/":
        return divide(num1, num2);
    }
  }
   
  const display = document.querySelector(".calculator__screen");
  let displayValue = "";
  let num1;
  let num2;
  let operator;
  let operationsArray = [];

  document.querySelectorAll(".number-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target.innerText >= 0 || e.target.innerText <= 9) {
        displayValue += e.target.innerText;
        display.innerText = displayValue;
      }
    });
  });