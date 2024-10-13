let resultField = document.getElementById('result');

function append(value) {
  resultField.value += value;
}

function clearDisplay() {
  resultField.value = '';
}

function calculate() {
  try {
    let expression = resultField.value;
    
    // Replace '^' with '**' for power function in JS
    expression = expression.replace('^', '**');
    
    let result = eval(expression);
    resultField.value = result;
  } catch (error) {
    resultField.value = 'Error';
  }
}
