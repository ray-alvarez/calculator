const numberButtons = document.querySelectorAll("#buttons-container .number");
const operatorButtons = document.querySelectorAll("#buttons-container .operator");
const display = document.querySelector("#display .result");
const resultButton = document.querySelector("#buttons-container .equal");
const clearButton = document.querySelector("#buttons-container .clear");
const signButton = document.querySelector("#buttons-container .sign");
const decimalButton = document.querySelector("#buttons-container .decimal");
const percentButton = document.querySelector("#buttons-container .percent")
var value = 0;
const inputState = {
    waitingForValue: 1, //can't input an operator
    waitingForOperator: 2, //cant input an operator
    displayingResult: 3
}
const operatorPrecedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
}
var displayState = inputState.waitingForValue;
var expression = [];
display.textContent = "0";

numberButtons.forEach( button => button.addEventListener("click",createOperand));
operatorButtons.forEach( button => button.addEventListener("click",addElementToExpression));
resultButton.addEventListener("click",displayResult);
clearButton.addEventListener("click",clear);
signButton.addEventListener("click",changeSign);
decimalButton.addEventListener("click",addDecimal);
backspaceButton.addEventListener("click",undo);

function undo(){

    let newContent;

    if(display.textContent != "0" && displayState != inputState.displayingResult){

        if(display.textContent.length != 1){
            newContent = display.textContent.substring(0,display.textContent.length-1)
            display.textContent = newContent;
        }else{
            display.textContent = "0";
            displayState = inputState.waitingForValue;
        }
    }
}

function addDecimal(){

   if(!display.textContent.includes(".")){
       display.textContent += ".";
   }
   if( displayState == inputState.displayingResult){
    display.textContent = "0.";
    displayState = inputState.waitingForValue;
   }
}

function changeSign(){
    display.textContent = -1*+display.textContent;
}

function displayResult(){

    let result;
    let postFixExpression;
    value = +display.textContent;

    if(displayState == inputState.waitingForOperator){

        expression.push(value);
        postFixExpression = convertToPostfix(expression);
        result = evaluatePostfix(postFixExpression);
        value = result;
        display.textContent = result;
        displayState = inputState.displayingResult;
    }
}
function evaluatePostfix(expresion){

    let currentToken;
    let valueStack = [];

    while(expresion.length != 0){

        currentToken = expresion[0];
        expresion.shift();

        if(typeof currentToken == "number"){
            valueStack.push(currentToken);

        //currentToken is an operator
        }else{

            let operand1 = valueStack.pop();
            let operand2 = valueStack.pop();
            let result = operate(currentToken,operand1,operand2);
            valueStack.push(result);
        }
    }
    //the final result is top of the valueStack
    return valueStack.pop();
}

function convertToPostfix(infixExpression){

    let currentToken;
    let operatorStack = [];
    let postfixExpression = [];
    let fromOperatorStack;

    while(infixExpression.length != 0){
       
        currentToken = infixExpression[0];
        infixExpression.shift();

        if(typeof currentToken == "number"){
            postfixExpression.push(currentToken);
        
        //currentToken is an operator
        }else{     

            while(operatorStack.length != 0){

                fromOperatorStack = operatorStack.pop();

                if(operatorPrecedence[fromOperatorStack] >= operatorPrecedence[currentToken]){
                    postfixExpression.push(fromOperatorStack);

                }else{
                    operatorStack.push(fromOperatorStack);
                    operatorStack.push(currentToken);
                    break;
                }
            }
            //all elements removed from operatorStack 
            if(operatorStack.length == 0){
                operatorStack.push(currentToken);
            }
        }
    }
    //infix is empty , remove all remaining operators from stack
    while(operatorStack != 0){
        fromOperatorStack = operatorStack.pop();
        postfixExpression.push(fromOperatorStack);
    }

    return postfixExpression;
}

function createOperand(){

    if(display.textContent == "0" && this.getAttribute("data-value") == "0"){
        return;
    }

    if(displayState == inputState.waitingForValue || displayState == inputState.displayingResult){

        if(display.textContent == "0."){
            display.textContent += this.getAttribute("data-value");
        }else{
            display.textContent = this.getAttribute("data-value");
        }

    }else if(displayState == inputState.waitingForOperator){

        if(display.textContent != "0" ){
            display.textContent += this.getAttribute("data-value");
        }  
    }

    displayState = inputState.waitingForOperator;
}

function addElementToExpression(){

    value = +display.textContent;

    if(displayState == inputState.waitingForOperator || displayState == inputState.displayingResult){
        let operator = this.getAttribute("data-operator");

        expression.push(value);
        expression.push(operator);
        clear();

    }else if(displayState == inputState.waitingForValue){
        return;
    }
}

function operate(operator,number1,number2){

    if(operator == "+"){
        return number2 + number1;
    }else if(operator == "-"){
        return number2 - number1;
    }else if(operator == "*"){
        return number2*number1;
    }else if(operator == "/"){
        return number2/number1;
    }
}

function clear(){

    display.textContent = "0";
    value = 0;
    displayState = inputState.waitingForValue;
}