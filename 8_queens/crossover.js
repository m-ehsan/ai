var parent1;
var parent2;
var newParent1;
var newParent2;
var preParent1;
var preParent2;
var bestChild;
var parent1Position;
var parent2Position;

function crossoverProcess() {
	// initialize population
	if (boards.length == 0) {
		initializeCrossoverPopulation();
	}

	// process next step
	if (nextStep) {
		nextStep = false;

		if (bestChild != null) {
			if (bestChild.fitness == 1) {
				return;
			}
		}

		step++;
		finishAllAnimations();

		preParent1 = parent1;
		preParent2 = parent2;

		parent1 = newParent1;
		parent2 = newParent2;
		animateNewParents();
		if (preParent1 != null)
			animatePreviousParents();

		// crossover chosen parents
		generateCrossedOverPopulation();
	}
}

function initializeCrossoverPopulation() {
	var count = populationCount;
	if (count < 2)
		count = 2;
	calculateSmallBoardSize(count);
	for (var i = 0; i < count; i++) {
		var newBoard = getRandomBoard();
		newBoard.size = smallBoardSize;
		newBoard.position = calculatePosition(i);
		boards.push(newBoard);
	}
	initParents();
	newParent1.highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(0.5)
	};
	newParent2.highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(0.5)
	};
	bestChild = findTheBest();
}

function generateCrossedOverPopulation() {
	if (bestChild.fitness != 1) {
		boards = [];
		calculateSmallBoardSize(9);
		for (var i = 0; i <= 8; i++) {
			var newBoard = crossoverBoards(parent1, parent2, i);
			newBoard.size = smallBoardSize;
			newBoard.position = calculatePosition(i);
			newBoard.displayCrossover = true;
			newBoard.opacity = 0;
			newBoard.opacityAnimation = {
				from: 0,
				to: 1,
				length: 0,
				progress: 0,
				delay: timeToFrames(0.6)
			}
			boards.push(newBoard);
		}
	}
	initParents();
	newParent1.highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(1.1)
	};
	newParent2.highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(1.1)
	};
	bestChild = findTheBest();
}

function initParents() {
	var parents;
	switch (crossoverMode) {
		case 0:
			parents = findTwoBestBoards();
			break;
		case 1:
			parents = findTwoWorstBoards();
			break;
		case 2:
			parents = findBestAndWorstBoards();
			break;
		case 3:
			parents = findTwoRandomBoards();
			break;
		default:
			break;
	}
	newParent1 = parents[0];
	newParent2 = parents[1];
}

function randomBoardIndexWithHeuristic(value, count) {
	var targetIndex = Math.floor(random(count));
	var encounter = 0;
	for (let i = 0; i < boards.length; i++) {
		const b = boards[i];
		if (b.heuristic == value) {
			if (encounter == targetIndex) {
				return i;
			}
			encounter++;
		}
	}
	return 0;
}

function findTwoBestBoards() {
	var best1Value, best2Value;
	var best1Count = 0, best2Count = 0;
	var best1Index, best2Index;

	// Count best heuristic repetition
	best1Value = boards[0].heuristic;
	boards.forEach(b => {
		if (b.heuristic < best1Value)
			best1Value = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == best1Value)
			best1Count++;
	});

	// Count second best heuristic repetition
	best2Value = 1000;
	boards.forEach(b => {
		if (b.heuristic > best1Value && b.heuristic < best2Value)
			best2Value = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == best2Value)
			best2Count++;
	});

	best1Index = randomBoardIndexWithHeuristic(best1Value, best1Count);
	best2Index = randomBoardIndexWithHeuristic(best2Value, best2Count);
	if (best1Count > 1) {
		best2Index = randomBoardIndexWithHeuristic(best1Value, best1Count);
		while (best1Index == best2Index) {
			best2Index = randomBoardIndexWithHeuristic(best1Value, best1Count);
		}
	}
	return [boards[best1Index], boards[best2Index]];
}

function findTwoWorstBoards() {
	var worst1Value, worst2Value;
	var worst1Count = 0, worst2Count = 0;
	var worst1Index, worst2Index;

	// Count worst heuristic repetition
	worst1Value = boards[0].heuristic;
	boards.forEach(b => {
		if (b.heuristic > worst1Value)
			worst1Value = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == worst1Value)
			worst1Count++;
	});

	// Count second worst heuristic repetition
	worst2Value = 0;
	boards.forEach(b => {
		if (b.heuristic < worst1Value && b.heuristic > worst2Value)
			worst2Value = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == worst2Value)
			worst2Count++;
	});

	worst1Index = randomBoardIndexWithHeuristic(worst1Value, worst1Count);
	worst2Index = randomBoardIndexWithHeuristic(worst2Value, worst2Count);
	if (worst1Count > 1) {
		worst2Index = randomBoardIndexWithHeuristic(worst1Value, worst1Count);
		while (worst1Index == worst2Index) {
			worst2Index = randomBoardIndexWithHeuristic(worst1Value, worst1Count);
		}
	}
	return [boards[worst1Index], boards[worst2Index]];
}

function findBestAndWorstBoards() {
	var bestValue, worstValue;
	var bestCount = 0, worstCount = 0;
	var bestIndex, worstIndex;

	// Count best heuristic repetition
	bestValue = boards[0].heuristic;
	boards.forEach(b => {
		if (b.heuristic < bestValue)
			bestValue = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == bestValue)
			bestCount++;
	});

	// Count worst heuristic repetition
	worstValue = boards[0].heuristic;
	boards.forEach(b => {
		if (b.heuristic > worstValue)
			worstValue = b.heuristic;
	});
	boards.forEach(b => {
		if (b.heuristic == worstValue)
			worstCount++;
	});

	bestIndex = randomBoardIndexWithHeuristic(bestValue, bestCount);
	worstIndex = randomBoardIndexWithHeuristic(worstValue, worstCount);

	return [boards[bestIndex], boards[worstIndex]];
}

function findTwoRandomBoards() {
	var index1 = Math.floor(random(boards.length));
	var index2 = Math.floor(random(boards.length));
	while (index1 == index2) {
		var index2 = Math.floor(random(boards.length));
	}
	return [boards[index1], boards[index2]];
}

function crossoverBoards(parent1, parent2, at) {
	var newQueens = parent1.queens.slice(0, at).concat(parent2.queens.slice(at, 8));
	var newBoard = new ChessBoard(newQueens, at);
	return newBoard;
}

function animateNewParents() {
	parent1.displayCrossover = false;
	parent2.displayCrossover = false;
	if (fastForward) {
		parent1.size = bestBoardSize;
		parent1.position = { x: parent1Position.x, y: parent1Position.y };
		parent1.highlightOpacity = 0;
		parent2.size = bestBoardSize;
		parent2.position = { x: parent2Position.x, y: parent2Position.y };
		parent2.highlightOpacity = 0;
	}
	else {
		parent1.sizeAnimation = {
			from: parent1.size,
			to: bestBoardSize,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		parent1.positionAnimation = {
			startX: parent1.x,
			endX: parent1Position.x,
			startY: parent1.y,
			endY: parent1Position.y,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		parent1.highlightAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.3),
			progress: 0,
			delay: 0
		};
		parent2.sizeAnimation = {
			from: parent2.size,
			to: bestBoardSize,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		parent2.positionAnimation = {
			startX: parent2.x,
			endX: parent2Position.x,
			startY: parent2.y,
			endY: parent2Position.y,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		parent2.highlightAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.3),
			progress: 0,
			delay: 0
		};
	}
}

function animatePreviousParents() {
	if (fastForward) {
		preParent1.opacity = 0;
		preParent2.opacity = 0;
	}
	else {
		preParent1.opacityAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		preParent2.opacityAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
	}
}