class Calculator {
  constructor() {
    this.curVal = null;
    this.secVal = null;
    this.dispVal = null;
    this.history = [];
    this.operator = null;
    this.prevOperator = null;
    this.allowOp = null;
    this.reset = false;
    this.percentage = false;
    document.querySelector('.backspace').addEventListener('click', event=>{
      this.backspace()
    })
  }

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

dispatch(val) {
  this.dispVal = val;
  return val;
}

dispatchHistory(val) {
  return (this.history = val ? [...this.history, val] : []);
}

updateHistory(val) {
  document.querySelector(".calculator__history").innerHTML =
    val.length > 0 ? val.join(" ") : "&nbsp;";
}

resetCalculator() {
  this.curVal = null;
  this.secVal = null;
  this.operator = null;
  this.prevOperator = null;
  this.percentage = null;
  this.dispVal = null;
  this.history = [];
  this.reset = false;
}

parse(val) {
  return parseFloat(val.toFixed(15));
}

allowInput(val) {
  return String(val).length <= 13;
}

allowPeriod(val) {
  return String(val).indexOf(".") !== -1;
}

backspace() {
    if(this.dispVal != null && this.history!=[]){
      if (this.operator === "=") {
        this.resetCalculator();
      } else if (this.secVal !== null) {
        this.secVal = this.secVal.slice(0, -1);
        this.dispatch(this.secVal || "0");
      } else {
        this.curVal = this.curVal.slice(0, -1);
        this.dispatch(this.curVal || "0");
      }
      if (this.dispVal === "0" || this.dispVal === null) {
        this.history.pop()
        this.updateHistory([]);
        this.resetCalculator()
      }
    }  
  }
process(val) {
  if (val >= 0 || val <= 9 || val === ".") {
    this.allowOp = true;
    if (!this.curVal && val === ".") {
      return 0;
    }

    if (this.operator === "=") {
      this.resetCalculator();
    }

    if (!this.operator) {
      if (this.curVal && !this.allowInput(this.curVal)) {
        return this.dispatch(this.curVal);
      }

      if (val === "." && this.allowPeriod(this.curVal)) {
        return this.dispatch(this.curVal);
      }

      this.curVal ? (this.curVal += val) : (this.curVal = val);
      this.dispatch(this.curVal);

    } else {
      if (this.secVal && !this.allowInput(this.secVal)) {
        return this.dispatch(this.secVal);
      }

      if (val === "." && this.allowPeriod(this.secVal)) {
        return this.dispatch(this.secVal);
      }

      !this.secVal || this.reset ? (this.secVal = val) : (this.secVal += val);

      this.dispatch(this.secVal);

      this.reset = false;
    }
  } else if (val === "+" || val === "-" || val === "x" || val === "÷") {
    if(!this.allowOp){
      return
    }
    if (this.operator === "=") {
      this.operator = val;
      this.reset = true;
      this.allowOp = null;
    } 

    else if (this.curVal && this.secVal) {
      this.curVal = this.dispatch(
        this.doCalc(this.operator, this.curVal, this.secVal)
      );
      this.reset = true;
    } else if (!this.curVal) {
      this.curVal = 0;
    }

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
    this.allowOp= null;

  } else if (val === "=") {
    if (!this.curVal && !this.secVal) {
      return this.dispVal || 0;
    }

    this.prevOperator = this.prevOperator ? this.prevOperator : this.operator;

    if (this.secVal) {

      if (val === this.operator) {
        this.curVal = this.dispatch(
          this.doCalc(this.prevOperator, this.curVal, this.secVal)
        );
      } else {

        this.curVal = this.dispatch(
          this.doCalc(this.operator, this.curVal, this.secVal)
        );
        this.operator = val;
        this.dispatchHistory(false);
        this.updateHistory(this.history);
      }

    } else if (!this.secVal && this.operator) {
      this.secVal = this.curVal;
      this.curVal = this.dispatch(
        this.doCalc(this.operator, this.curVal, this.secVal)
      );
      this.operator = val;
    }

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

(function () {
  const state = {};
  const init = () => {
    if (!state.calculator) {
      state.calculator = new Calculator();
    }
  };

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

const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "C"];

const keyMap = new Map();

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

function onKeyDown(e) {
  if (e.shiftKey) {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 16:
        break;
      default:

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