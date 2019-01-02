function Matrix(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.data = Array(this.rows);
	for (let i = 0; i < this.data.length; i++) {
		this.data[i] = Array(this.cols);
		for (let j = 0; j < this.cols; j++) {
			this.data[i][j] = 0;
		}
	}
}

Matrix.prototype.copy = function () {
	let m = new Matrix(this.rows, this.cols);
	for (let i = 0; i < this.rows; i++) {
		for (let j = 0; j < this.cols; j++) {
			m.data[i][j] = this.data[i][j];
		}
	}
	return m;
}

Matrix.prototype.fromArray = function (arr) {
	return new Matrix(arr.length, 1).map(function (e, i) { return arr[i]; });
}

Matrix.prototype.subtract = function (a, b) {
	if (a.rows !== b.rows || a.cols !== b.cols) {
		console.log('Columns and Rows of A must match Columns and Rows of B.');
		return;
	}

	// Return a new Matrix a-b
	return new Matrix(a.rows, a.cols)
		.map(function (_, i, j) { return a.data[i][j] - b.data[i][j]; });
}

Matrix.prototype.toArray = function () {
	let arr = [];
	for (let i = 0; i < this.rows; i++) {
		for (let j = 0; j < this.cols; j++) {
			arr.push(this.data[i][j]);
		}
	}
	return arr;
}

Matrix.prototype.randomize = function () {
	return this.map(function (e) { return Math.random() * 2 - 1; });
}

Matrix.prototype.add = function (n) {
	if (n instanceof Matrix) {
		if (this.rows !== n.rows || this.cols !== n.cols) {
			console.log('Columns and Rows of A must match Columns and Rows of B.');
			return;
		}
		return this.map(function (e, i, j) { return e + n.data[i][j]; });
	} else {
		return this.map(function (e) { return e + n; });
	}
}

Matrix.prototype.transpose = function (matrix) {
	return new Matrix(matrix.cols, matrix.rows)
		.map(function (_, i, j) { return matrix.data[j][i]; });
}

Matrix.prototype.multiply = function (a, b) {
	if (typeof b === 'undefined') {
		if (a instanceof Matrix) {
			if (this.rows !== a.rows || this.cols !== a.cols) {
				console.log('Columns and Rows of A must match Columns and Rows of B.');
				return;
			}

			// hadamard product
			return this.map(function (e, i, j) { return e * a.data[i][j]; });
		} else {
			// Scalar product
			return this.map(function (e) { return e * a; });
		}
	}

	// Matrix product
	if (a.cols !== b.rows) {
		console.log('Columns of A must match rows of B.');
		return;
	}

	return new Matrix(a.rows, b.cols)
		.map(function (e, i, j) {
			// Dot product of values in col
			let sum = 0;
			for (let k = 0; k < a.cols; k++) {
				sum += a.data[i][k] * b.data[k][j];
			}
			return sum;
		});
}

Matrix.prototype.map = function (a, b) {
	if (typeof b === 'undefined') {
		let func = a;
		// Apply a function to every element of matrix
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				let val = this.data[i][j];
				this.data[i][j] = func(val, i, j);
			}
		}
		return this;
	}

	let matrix = a;
	let func = b;
	// Apply a function to every element of matrix
	return new Matrix(matrix.rows, matrix.cols)
		.map(function (e, i, j) { return func(matrix.data[i][j], i, j); });
}

Matrix.prototype.print = function () {
	console.table(this.data);
	return this;
}

Matrix.prototype.serialize = function () {
	return JSON.stringify(this);
}

Matrix.prototype.deserialize = function (data) {
	if (typeof data == 'string') {
		data = JSON.parse(data);
	}
	let matrix = new Matrix(data.rows, data.cols);
	matrix.data = data.data;
	return matrix;
}

if (typeof module !== 'undefined') {
	module.exports = Matrix;
}
