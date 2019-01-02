// Other techniques for learning

function ActivationFunction(func, dfunc) {
	this.func = func;
	this.dfunc = dfunc;
}

let sigmoid = new ActivationFunction(
	function (x) { return 1 / (1 + Math.exp(-x)); },
	function (y) { return y * (1 - y); }
);

let tanh = new ActivationFunction(
	function (x) { return Math.tanh(x); },
	function (y) { return 1 - (y * y); }
);


function NeuralNetwork(in_nodes, hid_nodes, out_nodes) {
	/*
	* if first argument is a NeuralNetwork the constructor clones it
	* USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
	*/
	if (in_nodes instanceof NeuralNetwork) {
		let a = in_nodes;
		this.input_nodes = a.input_nodes;
		this.hidden_nodes = a.hidden_nodes;
		this.output_nodes = a.output_nodes;

		this.weights_ih = a.weights_ih.copy();
		this.weights_ho = a.weights_ho.copy();

		this.bias_h = a.bias_h.copy();
		this.bias_o = a.bias_o.copy();

		this.setLearningRate(a.learning_rate);
	} else {
		this.input_nodes = in_nodes;
		this.hidden_nodes = hid_nodes;
		this.output_nodes = out_nodes;

		this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
		this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
		this.weights_ih.randomize();
		this.weights_ho.randomize();

		this.bias_h = new Matrix(this.hidden_nodes, 1);
		this.bias_o = new Matrix(this.output_nodes, 1);
		this.bias_h.randomize();
		this.bias_o.randomize();

		this.setLearningRate();
	}

	// TODO: copy this as well
	this.setActivationFunction();
}

NeuralNetwork.prototype.predict = function (input_array) {
	// Generating the Hidden Outputs
	let inputs = Matrix.prototype.fromArray(input_array);
	let hidden = Matrix.prototype.multiply(this.weights_ih, inputs);
	hidden.add(this.bias_h);
	// activation function!
	hidden.map(this.activation_function.func);

	// Generating the output's output!
	let output = Matrix.prototype.multiply(this.weights_ho, hidden);
	output.add(this.bias_o);
	output.map(this.activation_function.func);

	// Sending back to the caller!
	return output.toArray();
}

NeuralNetwork.prototype.setLearningRate = function (learning_rate) {
	if (typeof learning_rate === 'undefined')
		learning_rate = 0.1;
	this.learning_rate = learning_rate;
}

NeuralNetwork.prototype.setActivationFunction = function (func) {
	if (typeof func === 'undefined')
		func = sigmoid;
	this.activation_function = func;
}

NeuralNetwork.prototype.train = function (input_nodes, target_array) {
	// Generating the Hidden Outputs
	let inputs = Matrix.prototype.fromArray(input_array);
	let hidden = Matrix.prototype.multiply(this.weights_ih, inputs);
	hidden.add(this.bias_h);
	// activation function!
	hidden.map(this.activation_function.func);

	// Generating the output's output!
	let outputs = Matrix.prototype.multiply(this.weights_ho, hidden);
	outputs.add(this.bias_o);
	outputs.map(this.activation_function.func);

	// Convert array to matrix object
	let targets = Matrix.prototype.fromArray(target_array);

	// Calculate the error
	// ERROR = TARGETS - OUTPUTS
	let output_errors = Matrix.prototype.subtract(targets, outputs);

	// let gradient = outputs * (1 - outputs);
	// Calculate gradient
	let gradients = Matrix.prototype.map(outputs, this.activation_function.dfunc);
	gradients.multiply(output_errors);
	gradients.multiply(this.learning_rate);


	// Calculate deltas
	let hidden_T = Matrix.prototype.transpose(hidden);
	let weight_ho_deltas = Matrix.prototype.multiply(gradients, hidden_T);

	// Adjust the weights by deltas
	this.weights_ho.add(weight_ho_deltas);
	// Adjust the bias by its deltas (which is just the gradients)
	this.bias_o.add(gradients);

	// Calculate the hidden layer errors
	let who_t = Matrix.prototype.transpose(this.weights_ho);
	let hidden_errors = Matrix.prototype.multiply(who_t, output_errors);

	// Calculate hidden gradient
	let hidden_gradient = Matrix.prototype.map(hidden, this.activation_function.dfunc);
	hidden_gradient.multiply(hidden_errors);
	hidden_gradient.multiply(this.learning_rate);

	// Calcuate input->hidden deltas
	let inputs_T = Matrix.prototype.transpose(inputs);
	let weight_ih_deltas = Matrix.prototype.multiply(hidden_gradient, inputs_T);

	this.weights_ih.add(weight_ih_deltas);
	// Adjust the bias by its deltas (which is just the gradients)
	this.bias_h.add(hidden_gradient);

	// outputs.print();
	// targets.print();
	// error.print();
}

NeuralNetwork.prototype.serialize = function () {
	return JSON.stringify(this);
}

NeuralNetwork.prototype.deserialize = function (data) {
	if (typeof data == 'string') {
		data = JSON.parse(data);
	}
	let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
	nn.weights_ih = Matrix.prototype.deserialize(data.weights_ih);
	nn.weights_ho = Matrix.prototype.deserialize(data.weights_ho);
	nn.bias_h = Matrix.prototype.deserialize(data.bias_h);
	nn.bias_o = Matrix.prototype.deserialize(data.bias_o);
	nn.learning_rate = data.learning_rate;
	return nn;
}

NeuralNetwork.prototype.copy = function () {
	return new NeuralNetwork(this);
}

// Accept an arbitrary function for mutation
NeuralNetwork.prototype.mutate = function (func) {
	this.weights_ih.map(func);
	this.weights_ho.map(func);
	this.bias_h.map(func);
	this.bias_o.map(func);
}