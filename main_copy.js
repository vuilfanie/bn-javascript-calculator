class Calculator {
    constructor() {
      this.curVal = null;
      this.secVal = null;
      this.dispVal = null;
      this.history = [];
      this.operator = null;
      this.prevOperator = null;
      this.reset = false;
      this.percentage = false;
    }
  
    // F) f) Parse values passed into the calculator and return float with 15 decimal places.
    parse(val) {
      return parseFloat(val.toFixed(15));
    }
  
    // A) & B) Perform calculation
    doCalc(op, curVal, secVal, operator = null) {
      const calculation = {
        "+": (curVal, secVal) => this.parse(curVal + secVal),
        "-": (curVal, secVal) => this.parse(curVal - secVal),
        x: (curVal, secVal) => this.parse(curVal * secVal),
        "÷": (curVal, secVal) => this.parse(curVal / secVal),
      };
  
      return operator
        ? calculation[op](parseFloat(curVal), parseFloat(secVal), operator)
        : calculation[op](parseFloat(curVal), parseFloat(secVal));
    }
  
    // E) a) set display value to the value passed in and then returns the value.
    dispatch(val) {
      this.dispVal = val;
      return val;
    }
  
    // E) set history array to the value passed
    dispatchHistory(val) {
      return (this.history = val ? [...this.history, val] : []);
    }
  
    // E) b)
    // updates the history display to the value passed 
    // check if value passed is greater than 0, 
    // and if it is, it joins all of the values 
    // in the array into a string. 
    // If it is not, it sets the display to an empty string.
    updateHistory(val) {
      document.querySelector(".calculator__history").innerHTML =
        val.length > 0 ? val.join(" ") : "&nbsp;";
    }
  
    // F) e) reset calculator to origin
    resetCalculator() {
      this.curVal = null;
      this.secVal = null;
      this.operator = null;
      this.prevOperator = null;
      this.percentage = null;
      this.dispVal = null;
      this.history = [];
      this.reset = false; // Resetting secVal to null
    }
  
    // check if value passed is less than or equal to 23
    allowInput(val) {
      return String(val).length <= 13;
    }
  
    // G) checks if the value passed in contains a period
    allowPeriod(val) {
      return String(val).indexOf(".") !== -1;
    }

    // backspace function
    backspace() {
      if (this.secVal) {
        this.secVal = this.secVal.slice(0, -1);
        this.dispatch(this.secVal);
      } else if (this.curVal) {
        this.curVal = this.curVal.slice(0, -1);
        this.dispatch(this.curVal);
      }
    }
  
    // main function "process" 
    process(val) {
      if (val >= 0 || val <= 9 || val === ".") {
        if (!this.curVal && val === ".") {
          return 0;
        }
  
        if (this.operator === "=") {
          this.resetCalculator();
        }
  
        // store first input value
        if (!this.operator) {
          if (this.curVal && !this.allowInput(this.curVal)) {
            return this.dispatch(this.curVal);
          }
          // G) check if period is allowed
          if (val === "." && this.allowPeriod(this.curVal)) {
            return this.dispatch(this.curVal);
          }
  
          this.curVal ? (this.curVal += val) : (this.curVal = val);
          this.dispatch(this.curVal);
          // store second input value
        } else {
          if (this.secVal && !this.allowInput(this.secVal)) {
            return this.dispatch(this.secVal);
          }
          // G) check if period is allowed
          if (val === "." && this.allowPeriod(this.secVal)) {
            return this.dispatch(this.secVal);
          }
  
          !this.secVal || this.reset ? (this.secVal = val) : (this.secVal += val);
  
          this.dispatch(this.secVal);
          // cancel second value reset flag
          this.reset = false;
        }
      } else if (val === "+" || val === "-" || val === "x" || val === "÷") {
        // Initiate second value reset
        if (this.operator === "=") {
          this.operator = val;
          this.reset = true;
        }
        // If both values present, perform calculation
        else if (this.curVal && this.secVal) {
          this.curVal = this.dispatch(
            this.doCalc(this.operator, this.curVal, this.secVal)
          );
          this.reset = true;
        } else if (!this.curVal) {
          this.curVal = 0;
        }    

        // F) a) history update
        if (this.curVal && !this.secVal) {
          this.dispatchHistory(this.curVal);
          this.dispatchHistory(val);
          this.updateHistory(this.history);
        } else if (this.secVal) {
          this.dispatchHistory(this.secVal);
          this.dispatchHistory(val);
          this.updateHistory(this.history);
        }
  
        this.prevOperator = null;
        this.operator = val;
  
  
        // F) b) assignment opertaion
      } else if (val === "=") {
        if (!this.curVal && !this.secVal) {
          return this.dispVal || 0;
        }
  
        // F) a) store previous operator
        this.prevOperator = this.prevOperator ? this.prevOperator : this.operator;
  
        if (this.secVal) {
          
          // Continue calculation with previous operator
          // if assignment operator is pressed
          if (val === this.operator) {
            this.curVal = this.dispatch(
              this.doCalc(this.prevOperator, this.curVal, this.secVal)
            );
          } else {
            // perform new calculation and assignment
            this.curVal = this.dispatch(
              this.doCalc(this.operator, this.curVal, this.secVal)
            );
            this.operator = val;
            this.dispatchHistory(false);
            this.updateHistory(this.history);
          }
  
          // if second value was not entered, compute with curVal
        } else if (!this.secVal && this.operator) {
          this.secVal = this.curVal;
          this.curVal = this.dispatch(
            this.doCalc(this.operator, this.curVal, this.secVal)
          );
          this.operator = val;
        }
  
        // set negative/positive
      } else if (val === "+/-") {
        if (
          (this.curVal && !this.secVal) ||
          (this.curVal && this.operator === "=")
        ) {
          this.curVal =
            parseFloat(this.curVal) > 0
              ? -Math.abs(this.curVal)
              : Math.abs(this.curVal);
          this.dispatch(this.curVal);
        } else {
          this.secVal =
            parseFloat(this.secVal) > 0
              ? -Math.abs(this.secVal)
              : Math.abs(this.secVal);
          this.dispatch(this.secVal);
        }
      } else if (val === "C") {
        this.resetCalculator();
        this.updateHistory(this.history);
      } else if (val === "backspace") {
        this.backspace();
      }
      console.log(this);
      return this.dispVal || 0;
    }
  }
  
  (function() {
    const state = {};
    const init = () => {
      if (!state.calculator) {
        state.calculator = new Calculator();
      }
    };
  
    // D) 
    init();
  
    const getInput = val => {
      updateDisplay(state.calculator.process(val));
    };
  
    const updateDisplay = val => {
      document.querySelector(".calculator__display").innerText = val;
    };
  
    const els = Array.from(document.querySelectorAll(".calculator__btn-value"));
    els.forEach(el =>
      el.addEventListener("click", e => {
        const val = e.target.innerText;
        getInput(val);
      })
    );
  
    // top row keys and C
    const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "C"];
  
    const keyMap = new Map();
  
    // I)
    // numpad keys
    // anything higher than 400 is a custom keyCode for shift
    // key code values https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    keyMap.set(27, "C");
    keyMap.set(96, "0");
    keyMap.set(97, "1");
    keyMap.set(98, "2");
    keyMap.set(99, "3");
    keyMap.set(100, "4");
    keyMap.set(101, "5");
    keyMap.set(102, "6");
    keyMap.set(103, "7");
    keyMap.set(104, "8");
    keyMap.set(105, "9");
    keyMap.set(106, "x");
    keyMap.set(88, "x");
    keyMap.set(456, "x");
    keyMap.set(107, "+");
    keyMap.set(587, "+");
    keyMap.set(109, "-");
    keyMap.set(189, "-");
    keyMap.set(111, "÷");
    keyMap.set(13, "=");
    keyMap.set(187, "=");
    keyMap.set(110, ".");
    keyMap.set(190, ".");
    keyMap.set(191, "÷");
    keyMap.set(8, "backspace");
  
    for (const key of keys) {
      keyMap.set(key.charCodeAt(0), key);
    }
  
    //  I) Keyboard events
    function onKeyDown(e) {
      if (e.shiftKey) {
        console.log(e.keyCode);
        switch (e.keyCode) {
          case 16:
            break;
          default:
            // if (keyMap.get(e.keyCode) && e.keyCode < 96) {
            if (e.keyCode === 56 || e.keyCode === 187 || e.keyCode === 53) {
              state.shiftKey = true;
  
              getInput(keyMap.get(e.keyCode + 400));
              document
                .querySelector(`.calculator__btn-value[data-key*="${e.keyCode + 400}"]`)
                .classList.add("btn__keypress");
              break;
            }
            break;
        }
      } else {
        if (keyMap.get(e.keyCode)) {
          getInput(keyMap.get(e.keyCode));
          document
            .querySelector(`.calculator__btn-value[data-key*="${e.keyCode}"]`)
            .classList.add("btn__keypress");
  
        }
      }
    }
  
    // with the shift key pressed
    function onKeyUp(e) {
      if (keyMap.get(e.keyCode)) {
        if (state.shiftKey) {
          document
            .querySelector(`.calculator__btn-value[data-key*="${e.keyCode + 400}"]`)
            .classList.remove("btn__keypress");
        }
        state.shiftKey = false;
  
        document
          .querySelector(`.calculator__btn-value[data-key*="${e.keyCode}"]`)
          .classList.remove("btn__keypress");
      }
    }
  
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

  })();