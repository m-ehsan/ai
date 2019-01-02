function ChessBoard(queens, crossOverAt) {
	if (typeof crossOverAt != "number")
		crossOverAt = 0;
	this.queens = queens;
	this.crossOverAt = crossOverAt;
	this.displayCrossover = false;
	this.position = { x: 0, y: 0 };
	this.positionAnimation = null;
	this.opacityAnimation = null;
	this.sizeAnimation = null;
	this.highlightAnimation = null;
	this.highlightOpacity = 0;
	this.size = 100;
	this.textSize = 14 * this.size / 100;
	this.opacity = 1;
	this.alpha = 255;
	this.borderColor = color(20, this.alpha);
	this.highlightColor = color(200, 70, 85, this.alpha);
	this.crossOverLineColor = color(200, 50, 60, this.alpha);
	this.cellWidth = this.size / 8;
	this.borderThickness = this.size / 200;
	this.crossOverLineThickness = this.size / 60;
	this.calculateFitness();
}

ChessBoard.prototype.setSize = function (size) {
	this.size = size;
	this.cellWidth = size / 8;
	this.borderThickness = size / 200;
	this.crossOverLineThickness = size / 60;
	this.textSize = 14 * size / 100;
}

ChessBoard.prototype.setOpacity = function (opacity) {
	this.opacity = opacity;
	this.alpha = opacity * 255;
	this.borderColor = color(20, this.alpha);
	this.highlightColor = color(200, 70, 85, this.alpha);
	this.crossOverLineColor = color(200, 50, 60, this.alpha);
}

ChessBoard.prototype.handleAnimations = function () {
	// Position animation handler
	if (this.positionAnimation != null) {
		if (this.positionAnimation.delay > 0) {
			this.positionAnimation.delay--;
		}
		else {
			this.position.x = this.positionAnimation.startX +
				(this.positionAnimation.progress / this.positionAnimation.length * (this.positionAnimation.endX - this.positionAnimation.startX));
			this.position.y = this.positionAnimation.startY +
				(this.positionAnimation.progress / this.positionAnimation.length * (this.positionAnimation.endY - this.positionAnimation.startY));
			this.positionAnimation.progress++
			if (this.positionAnimation.progress > this.positionAnimation.length) {
				this.position.x = this.positionAnimation.endX;
				this.position.y = this.positionAnimation.endY;
				this.positionAnimation = null;
			}
		}
	}

	// Opacity animation handler
	if (this.opacityAnimation != null) {
		if (this.opacityAnimation.delay > 0) {
			this.opacityAnimation.delay--;
		}
		else {
			this.setOpacity(this.opacityAnimation.from + (this.opacityAnimation.progress++ / this.opacityAnimation.length * (this.opacityAnimation.to - this.opacityAnimation.from)));
			if (this.opacityAnimation.progress > this.opacityAnimation.length) {
				this.setOpacity(this.opacityAnimation.to);
				this.opacityAnimation = null;
			}
		}
	}

	// Size animation handler
	if (this.sizeAnimation != null) {
		if (this.sizeAnimation.delay > 0) {
			this.sizeAnimation.delay--;
		}
		else {
			this.setSize(this.sizeAnimation.from + (this.sizeAnimation.progress++ / this.sizeAnimation.length * (this.sizeAnimation.to - this.sizeAnimation.from)));
			if (this.sizeAnimation.progress > this.sizeAnimation.length) {
				this.setSize(this.sizeAnimation.to);
				this.sizeAnimation = null;
			}
		}
	}

	// Highlight opacity animation handler
	if (this.highlightAnimation != null) {
		if (this.highlightAnimation.delay > 0) {
			this.highlightAnimation.delay--;
		}
		else {
			this.highlightOpacity = this.highlightAnimation.from +
				(this.highlightAnimation.progress++ / this.highlightAnimation.length * (this.highlightAnimation.to - this.highlightAnimation.from));
			if (this.highlightAnimation.progress > this.highlightAnimation.length) {
				this.highlightOpacity = this.highlightAnimation.to;
				this.highlightAnimation = null;
			}
		}
	}
}

ChessBoard.prototype.display = function () {
	// progress animations by updating properties
	this.handleAnimations();

	// invisible
	if (this.alpha == 0) {
		return;
	}

	// draw board
	if (this.opacity < 1 && this.opacity > 0)
		tint(255, this.alpha);
	image(boardImg, this.position.x, this.position.y, this.size, this.size);

	// draw cross over line
	if (this.displayCrossover) {
		strokeWeight(this.crossOverLineThickness);
		stroke(color(red(this.crossOverLineColor), green(this.crossOverLineColor), blue(this.crossOverLineColor), this.alpha));
		line(this.position.x + this.crossOverAt * this.cellWidth, this.position.y, this.position.x + this.crossOverAt * this.cellWidth, this.position.y + this.size);
	}

	// draw border
	noFill();
	strokeWeight(this.borderThickness);
	stroke(color(red(this.borderColor), green(this.borderColor), blue(this.borderColor), this.alpha));
	rect(this.position.x - this.borderThickness / 2, this.position.y - this.borderThickness / 2, this.size + this.borderThickness, this.size + this.borderThickness);

	// draw queens
	for (let i = 0; i < 8; i++) {
		image(queenImg, this.position.x + i * this.cellWidth, this.position.y + this.queens[i] * this.cellWidth, this.cellWidth, this.cellWidth);
	}

	// draw heuristic value
	textSize(this.textSize);
	fill(color(30, 110, 240, this.alpha));
	strokeWeight(0.3);
	stroke(30, this.alpha);
	textAlign(CENTER, TOP);
	text("h = " + this.threatingPairsCount, this.position.x + this.size / 2, this.position.y + this.size + this.textSize / 4);

	// draw board highlight
	if (this.highlightOpacity > 0) {
		noFill();
		strokeWeight(this.borderThickness * 10);
		stroke(color(red(this.highlightColor), green(this.highlightColor), blue(this.highlightColor), this.alpha * this.highlightOpacity));
		rect(this.position.x - this.borderThickness * 10, this.position.y - this.borderThickness * 10, this.size + this.borderThickness * 20, this.size + this.textSize * 1.8, this.size / 50);
	}

	noTint();
}

ChessBoard.prototype.finishAnimation = function () {
	if (this.positionAnimation != null) {
		this.position.x = this.positionAnimation.endX;
		this.position.y = this.positionAnimation.endY;
		this.positionAnimation = null;
	}

	if (this.opacityAnimation != null) {
		this.setOpacity(this.opacityAnimation.to);
		this.opacityAnimation = null;
	}

	if (this.sizeAnimation != null) {
		this.setSize(this.sizeAnimation.to);
		this.sizeAnimation = null;
	}

	if (this.highlightAnimation != null) {
		this.highlightOpacity = this.highlightAnimation.to;
		this.highlightAnimation = null;
	}
}

ChessBoard.prototype.calculateFitness = function () {
	let threatingPairsCount = 0;
	for (let i = 0; i < 7; i++) {
		for (let j = i + 1; j < 8; j++) {
			if ((this.queens[i] == this.queens[j]) || ((j - i) == Math.abs(this.queens[i] - this.queens[j]))) {
				threatingPairsCount++;
			}
		}
	}
	this.threatingPairsCount = threatingPairsCount;
	this.fitness = 1 / (this.threatingPairsCount + 1);
}
