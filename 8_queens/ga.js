var currentBoard;
var previousBoard;
var newTwoBests;
var helperBoard1;
var helperBoard2;
var numberOfTries = 0;
var delayNextGeneration = false; // delay appearing of new set of boards till chosen boards finish their animations

function GAProcess() {
	// initialize population
	if (boards.length == 0)
		initialzePopulation();

	if (!nextStep)
		return; // do nothing until next step command received

	// process next step
	nextStep = false;

	if (currentBoard != null) {
		if (currentBoard.fitness == 1)
			return; // do nothing if problem is solved
	}

	step++;
	finishAllAnimations();

	previousBoard = currentBoard;

	if (gaMode == 0) { // only mutate the best board
		if (currentBoard == null) {
			moveTheNewBestBoard();
		}
		else if (newTwoBests[0].fitness > currentBoard.fitness) {
			moveTheNewBestBoard();
		}
		else {
			if (numberOfTries < numberOfTriesOnEachBoard) {
				numberOfTries++;
			}
			else {
				numberOfTries = 0;
				moveTheNewBestBoard();
			}
		}
	}
	else { // crossover + mutate the best boards
		if (currentBoard == null) {
			crossoverAndMoveTwoNewBestBoards();
		}
		else if (newTwoBests[0].fitness > currentBoard.fitness) {
			if (newTwoBests[0].fitness == 1) {
				removeHightlights();
				moveTheNewBestBoard();
			}
			else {
				crossoverAndMoveTwoNewBestBoards();
			}
		}
		else {
			crossoverAndMoveTwoNewBestBoards();
		}
	}

	// mutate the best
	generateMutatedPopulation(delayNextGeneration);
}

function initialzePopulation() {
	calculateSmallBoardSize(populationCount);
	for (let i = 0; i < populationCount; i++) {
		let newBoard = getRandomBoard();
		newBoard.opacityAnimation = {
			from: 0,
			to: 1,
			length: timeToFrames(1 / populationCount),
			progress: 0,
			delay: i * timeToFrames(1 / populationCount)
		};
		newBoard.size = smallBoardSize;
		newBoard.opacity = 0;
		newBoard.position = calculatePosition(i);
		boards.push(newBoard);
	}
	findAndHighlightBestBoards(1);
}

function generateMutatedPopulation(delay = false) {
	if (currentBoard.fitness != 1) {
		let extraDelayAmount = (delay) ? 0.6 : 0;
		boards = [];
		calculateSmallBoardSize(populationCount);
		for (let i = 0; i < populationCount; i++) {
			let temp = mutateBoard(currentBoard);
			temp.opacityAnimation = {
				from: 0,
				to: 1,
				length: timeToFrames(1 / populationCount),
				progress: 0,
				delay: i * timeToFrames(1 / populationCount) + timeToFrames(extraDelayAmount)
			};
			temp.size = smallBoardSize;
			temp.opacity = 0;
			temp.position = calculatePosition(i);
			boards.push(temp);
		}
		findAndHighlightBestBoards(1 + extraDelayAmount);
	}
}

function findAndHighlightBestBoards(delay = 0) {
	if (currentBoard != null)
		if (currentBoard.fitness == 1)
			return;

	newTwoBests = findTwoBestBoards();
	newTwoBests[0].highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(delay)
	};
	if (gaMode == 1) {
		newTwoBests[1].highlightAnimation = {
			from: 0,
			to: 1,
			length: timeToFrames(0.5),
			progress: 0,
			delay: timeToFrames(delay)
		};
	}
}

function removeHightlights() {
	newTwoBests.forEach(b => {
		b.highlightOpacity = 0;
	});
}

function moveTheNewBestBoard() {
	currentBoard = newTwoBests[0];
	delayNextGeneration = true;
	animateBestBoard(currentBoard);
	hidePreviousBoard();
}

function crossoverAndMoveTwoNewBestBoards() {
	let at = Math.floor(random(9));
	currentBoard = crossoverBoards(newTwoBests[0], newTwoBests[1], at);
	delayNextGeneration = true;
	helperBoard1 = newTwoBests[0];
	helperBoard2 = newTwoBests[1];
	animateBestBoard(helperBoard1, true);
	animateBestBoard(helperBoard2, true);
	animateCurrentBoard();
	hidePreviousBoard();
}

function mutateBoard(parent) {
	let queens = parent.queens.slice();
	let randomColumn = getRandomRow();
	let randomRow = getRandomRow();
	while (queens[randomColumn] == randomRow) {
		randomRow = getRandomRow();
	}
	queens[randomColumn] = randomRow;
	return new ChessBoard(queens);
}

function animateBestBoard(board, fadeOut = false) {
	if (fastForward) {
		board.size = bestBoardSize;
		board.position = { x: bestBoardPosition.x, y: bestBoardPosition.y };
		board.highlightOpacity = 0;
		if (fadeOut)
			board.opacity = 0;
	}
	else {
		board.sizeAnimation = {
			from: board.size,
			to: bestBoardSize,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		board.positionAnimation = {
			startX: board.x,
			endX: bestBoardPosition.x,
			startY: board.y,
			endY: bestBoardPosition.y,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		board.highlightAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.3),
			progress: 0,
			delay: 0
		};
		if (fadeOut) {
			board.opacityAnimation = {
				from: 1,
				to: 0,
				length: timeToFrames(0.5),
				progress: 0,
				delay: 0
			};
		}
	}
}

function hidePreviousBoard() {
	if (previousBoard == null)
		return;

	previousBoard.opacity = 0;
}

function animateCurrentBoard() {
	currentBoard.size = bestBoardSize;
	currentBoard.position = { x: bestBoardPosition.x, y: bestBoardPosition.y };
	currentBoard.opacity = 0;
	if (fastForward) {
		currentBoard.opacity = 1;
	}
	else {
		currentBoard.opacityAnimation = {
			from: 0,
			to: 1,
			length: timeToFrames(0.3),
			progress: 0,
			delay: timeToFrames(0.5)
		};
	}
}

function findTwoBestBoards() {
	let bestFitness, secondBestFitness;
	let bestCount = 0, secondBestCount = 0;
	let bestIndex, secondBestIndex;

	// Count best fitness repetition
	bestFitness = boards[0].fitness;
	boards.forEach(b => {
		if (b.fitness > bestFitness)
			bestFitness = b.fitness;
	});
	boards.forEach(b => {
		if (b.fitness == bestFitness)
			bestCount++;
	});

	// Count second best fitness repetition
	secondBestFitness = 0;
	boards.forEach(b => {
		if (b.fitness < bestFitness && b.fitness > secondBestFitness)
			secondBestFitness = b.fitness;
	});
	boards.forEach(b => {
		if (b.fitness == secondBestFitness)
			secondBestCount++;
	});

	bestIndex = randomBoardIndexWithFitness(bestFitness, bestCount);
	secondBestIndex = randomBoardIndexWithFitness(secondBestFitness, secondBestCount);
	if (bestCount > 1) {
		secondBestIndex = randomBoardIndexWithFitness(bestFitness, bestCount);
		while (bestIndex == secondBestIndex) {
			secondBestIndex = randomBoardIndexWithFitness(bestFitness, bestCount);
		}
	}
	return [boards[bestIndex], boards[secondBestIndex]];
}

function randomBoardIndexWithFitness(Fitness, count) {
	let targetIndex = Math.floor(random(count));
	let encounter = 0;
	for (let i = 0; i < boards.length; i++) {
		const b = boards[i];
		if (b.fitness == Fitness) {
			if (encounter == targetIndex) {
				return i;
			}
			encounter++;
		}
	}
	return 0;
}

function crossoverBoards(parent1, parent2, at) {
	let newQueens = parent1.queens.slice(0, at).concat(parent2.queens.slice(at, 8));
	let newBoard = new ChessBoard(newQueens, at);
	newBoard.displayCrossover = true;
	return newBoard;
}