class ChessBoard {
	constructor(queens, crossOverAt = 0) {
		this.queens = queens;
		this.crossOverAt = crossOverAt;
		this._displayCrossover = false;
		this.x = 100;
		this.y = 100;
		this._positionAnimation = null;
		this._opacityAnimation = null;
		this._sizeAnimation = null;
		this._highlightAnimation = null;
		this._highlightOpacity = 0;
		this._size = 100;
		this.textSize = 12 * this._size / 100;
		this._opacity = 1;
		this.alpha = 255;
		this.borderColor = color(20, alpha);
		this.highlightColor = color(200, 70, 85, alpha);
		this.crossOverLineColor = color(200, 50, 60, alpha);
		this.cellWidth = this._size / 8;
		this.borderThickness = this._size / 200;
		this.crossOverLineThickness = this._size / 60;
		this.calculateFitness();
	}

	set displayCrossover(value){
		this._displayCrossover = value;
	}

	set highlightOpacity(value) {
		this._highlightOpacity = value;
	}

	set highlightAnimation(ha) {
		this._highlightAnimation = ha;
	}

	set positionAnimation(pa) {
		this._positionAnimation = pa;
	}

	set opacityAnimation(oa) {
		this._opacityAnimation = oa;
	}

	set sizeAnimation(sa) {
		this._sizeAnimation = sa;
	}

	set size(size) {
		this._size = size;
		this.cellWidth = size / 8;
		this.borderThickness = size / 200;
		this.crossOverLineThickness = size / 60;
		this.textSize = 14 * size / 100;
	}

	get size() {
		return this._size;
	}

	set position(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}

	set opacity(opacity) {
		this._opacity = opacity;
		this.alpha = opacity * 255;
	}

	get opacity() {
		return this._opacity;
	}

	handleAnimations() {
		// Position animation handler
		if (this._positionAnimation != null) {
			if (this._positionAnimation.delay > 0) {
				this._positionAnimation.delay--;
			}
			else {
				this.x = this._positionAnimation.startX +
					(this._positionAnimation.progress / this._positionAnimation.length * (this._positionAnimation.endX - this._positionAnimation.startX));
				this.y = this._positionAnimation.startY +
					(this._positionAnimation.progress / this._positionAnimation.length * (this._positionAnimation.endY - this._positionAnimation.startY));
				this._positionAnimation.progress++
				if (this._positionAnimation.progress > this._positionAnimation.length) {
					this.x = this._positionAnimation.endX;
					this.y = this._positionAnimation.endY;
					this._positionAnimation = null;
				}
			}
		}

		// Opacity animation handler
		if (this._opacityAnimation != null) {
			if (this._opacityAnimation.delay > 0) {
				this._opacityAnimation.delay--;
			}
			else {
				this.opacity = this._opacityAnimation.from +
					(this._opacityAnimation.progress++ / this._opacityAnimation.length * (this._opacityAnimation.to - this._opacityAnimation.from));
				if (this._opacityAnimation.progress > this._opacityAnimation.length) {
					this.opacity = this._opacityAnimation.to;
					this._opacityAnimation = null;
				}
			}
		}

		// Size animation handler
		if (this._sizeAnimation != null) {
			if (this._sizeAnimation.delay > 0) {
				this._sizeAnimation.delay--;
			}
			else {
				this.size = this._sizeAnimation.from +
					(this._sizeAnimation.progress++ / this._sizeAnimation.length * (this._sizeAnimation.to - this._sizeAnimation.from));
				if (this._sizeAnimation.progress > this._sizeAnimation.length) {
					this.size = this._sizeAnimation.to;
					this._sizeAnimation = null;
				}
			}
		}

		// Highlight opacity animation handler
		if (this._highlightAnimation != null) {
			if (this._highlightAnimation.delay > 0) {
				this._highlightAnimation.delay--;
			}
			else {
				this._highlightOpacity = this._highlightAnimation.from +
					(this._highlightAnimation.progress++ / this._highlightAnimation.length * (this._highlightAnimation.to - this._highlightAnimation.from));
				if (this._highlightAnimation.progress > this._highlightAnimation.length) {
					this._highlightOpacity = this._highlightAnimation.to;
					this._highlightAnimation = null;
				}
			}
		}
	}

	display() {
		// progress animations by updating properties
		this.handleAnimations();

		// invisible
		if (this.alpha == 0) {
			return;
		}

		// draw board
		if (this._opacity < 1 && this._opacity > 0)
			tint(255, this.alpha);
		image(boardImg, this.x, this.y, this._size, this._size);

		// draw cross over line
		if (this._displayCrossover) {
			strokeWeight(this.crossOverLineThickness);
			stroke(color(red(this.crossOverLineColor), green(this.crossOverLineColor), blue(this.crossOverLineColor), this.alpha));
			line(this.x + this.crossOverAt * this.cellWidth, this.y, this.x + this.crossOverAt * this.cellWidth, this.y + this._size);
		}

		// draw border
		noFill();
		strokeWeight(this.borderThickness);
		stroke(color(red(this.borderColor), green(this.borderColor), blue(this.borderColor), this.alpha));
		rect(this.x - this.borderThickness / 2, this.y - this.borderThickness / 2, this._size + this.borderThickness, this._size + this.borderThickness);

		// draw queens
		for (let i = 0; i < 8; i++) {
			image(queenImg, this.x + i * this.cellWidth, this.y + this.queens[i] * this.cellWidth, this.cellWidth, this.cellWidth);
		}

		// draw heuristic value
		textSize(this.textSize);
		fill(color(30, 110, 240, this.alpha));
		strokeWeight(0.3);
		stroke(30, this.alpha);
		textAlign(CENTER, TOP);
		text("h = " + this.threatingPairsCount, this.x + this._size / 2, this.y + this._size + this.textSize / 4);

		// draw board highlight
		if (this._highlightOpacity > 0) {
			noFill();
			strokeWeight(this.borderThickness * 10);
			stroke(color(red(this.highlightColor), green(this.highlightColor), blue(this.highlightColor), this.alpha * this._highlightOpacity));
			rect(this.x - this.borderThickness * 10, this.y - this.borderThickness * 10, this._size + this.borderThickness * 20, this._size + this.textSize * 1.8, this._size / 50);
		}

		noTint();
	}

	finishAnimation() {
		if (this._positionAnimation != null) {
			this.x = this._positionAnimation.endX;
			this.y = this._positionAnimation.endY;
			this._positionAnimation = null;
		}

		if (this._opacityAnimation != null) {
			this.opacity = this._opacityAnimation.to;
			this._opacityAnimation = null;
		}

		if (this._sizeAnimation != null) {
			this.size = this._sizeAnimation.to;
			this._sizeAnimation = null;
		}

		if (this._highlightAnimation != null) {
			this._highlightOpacity = this._highlightAnimation.to;
			this._highlightAnimation = null;
		}
	}

	calculateFitness() {
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
}