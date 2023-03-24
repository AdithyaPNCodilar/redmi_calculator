const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

for (let key of keys) {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		if (value == "clear") {
			input = "";
			display_input.innerHTML = "";
			display_output.innerHTML = "";
		} else if (value == "backspace") {
			input = input.slice(0, -1);
			display_input.innerHTML = GetInput(input);
		} else if (value == "=") {
			let result = eval(PrepareInput(input));
			display_output.innerHTML = GetOutput(result);
		} else if (value == "brackets") {
			if (
				input.indexOf("(") == -1 || 
				input.indexOf("(") != -1 && 
				input.indexOf(")") != -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") != -1 && 
				input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 &&
				input.indexOf(")") != -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")";
			}

			display_input.innerHTML = GetInput(input);
		} else {
			if (ValidateInput(value)) {
				input += value;
				display_input.innerHTML = GetInput(input);
			}
		}
	})
}

function GetInput(input) {
	let input_array = input.split("");
	let input_array_length = input_array.length;

	for (let i = 0; i < input_array_length; i++) {
		if (input_array[i] == "*") {
			input_array[i] = ` <span class="operator">x</span> `;
		} else if (input_array[i] == "/") {
			input_array[i] = ` <span class="operator">÷</span> `;
		} else if (input_array[i] == "+") {
			input_array[i] = ` <span class="operator">+</span> `;
		} else if (input_array[i] == "-") {
			input_array[i] = ` <span class="operator">-</span> `;
		} else if (input_array[i] == "(") {
			input_array[i] = `<span class="brackets">(</span>`;
		} else if (input_array[i] == ")") {
			input_array[i] = `<span class="brackets">)</span>`;
		} else if (input_array[i] == "%") {
			input_array[i] = `<span class="percent">%</span>`;
		}
	}

	return input_array.join("");
}

function GetOutput (output) {
	let output_string = output.toString();
	let decimal = output_string.split(".")[1];
	output_string = output_string.split(".")[0];

	let output_array = output_string.split("");
	
	if (output_array.length > 3 && !isNaN(output_array)) {
		for (let i = output_array.length - 3; i > 0; i -= 3) {
			output_array.splice(i, 0, ",");
		}
	}

	if (decimal) {
		output_array.push(".");
		output_array.push(decimal);
	}

	return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/","%"];
  
    if (value == "." && last_input == ".") {
        return false;
    }

    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            // If last input was also an operator, replace it with the new operator
            input = input.slice(0, -1) + value;
            display_input.innerHTML = GetInput(input);
            return false;
        } else {
            return true;
        }
    }
    return true;
}

function PrepareInput(input) {
	let input_array = input.split("");
	
	for (let i = 0; i < input_array.length; i++) {
	  if (input_array[i] == "%") {
		let j = i - 1;
		let operand = "";
		while (/[0-9\.]/.test(input_array[j])) {
		  operand = (input_array[j] + operand)*10;
		  j--;
		}
		if (j == i - 1) {
		  // if there is no operand before the `%` operator, treat it as a divide by 100
		  let expression = parseFloat(input_array.slice(0, i).join("")) * 0.01;
		  input_array.splice(0, i + 1, expression.toString());
		} else {
		  let percent = parseFloat(operand) * 0.01;
		  let expression = percent * parseFloat(input_array.slice(j + 1, i).join(""));
		  input_array.splice(j + 1, i - j, expression.toString());
		}
		i = j + 1;
	  }
	}
	
	return input_array.join("");
  }
  