// general
var canvas;
var canvasWidth = 1200;
var canvasHeight = 680;
var fps = 60;
var pause = false;
var cyclesPerFrame = 1; // visual speed of the process
var fastForward = false; // for skipping generations
var showAllDots = true;

// dots
var population;
var populationSize = 1000; // number of dots
var instructionsCount = 1000; // length of instruction series
var mutationRate = 0.01;
var dotRadius = 6;

// starting point
var startX = 30;
var startY = 340;

// destination point
var goalX = 1170;
var goalY = 340;
var goalRadius = 12;

// obstacles
var obstacles = [];

// brains
var goodBrainJSON;

function preload() {
    // load stored brain json files
    goodBrainJSON = loadJSON('brains/250.json');
}

function setup() {
    frameRate(fps);
    canvas = createCanvas(canvasWidth, canvasHeight);
    centerCanvas();

    // initialize obstacles
    obstacles[0] = { x: 500, y: 0, width: 30, height: 400 };
    obstacles[1] = { x: 500, y: 450, width: 30, height: 230 };
    obstacles[2] = { x: 900, y: 250, width: 30, height: 330 };

    // initialize population
    population = new Population(populationSize);
}

function draw() {
    handleMutationRateChange();
    handleCyclePerFrameChange();
    background(250);
    drawObstacles();
    displayUI();

    // draw goal
    stroke(0);
    strokeWeight(0.5);
    fill(color(53, 135, 198));
    ellipse(goalX, goalY, goalRadius * 2, goalRadius * 2);

    if (fastForward) {
        if (!pause) {
            while (!population.allDotsHaveStopped()) {
                population.update();
            }
            population.calculateDotsFitness();
            population.createNextGeneration();
            population.mutateAllDots();
        }
    }
    else {
        if (population.allDotsHaveStopped()) {
            population.calculateDotsFitness();
            population.createNextGeneration();
            population.mutateAllDots();
        }
        else {
            if (!pause) {
                for (let i = 0; i < cyclesPerFrame; i++)
                    population.update();
            }
            population.show();
        }
    }

    // displayFPS();
}

function keyPressed() {
    switch (keyCode) {
        case 37: // Left-Arrow key
            decreasePopulation();
            break;
        case 39: // Right-Arrow key
            increasePopulation();
            break;
        case 68: // D key
            DownloadBestBrainJson();
            break;
        case 70: // F key
            fastForward = !fastForward;
            break;
        case 76: // L key
            loadBrain(goodBrainJSON);
            break;
        case 80: // P key
            pause = !pause;
            break;
        case 82: // R key
            reset();
            break;
        case 83: // S key
            showAllDots = !showAllDots;
            break;
        default:
            break;
    }
}

function drawObstacles() {
    obstacles.forEach(function (o) {
        noStroke();
        fill(color(198, 53, 53));
        rect(o.x, o.y, o.width, o.height);
    });
}

function reset() {
    population = new Population(populationSize);
    showAllDots = true;
}

function DownloadBestBrainJson() {
    saveJSON(population.dots[0].brain, population.bestStep + ".json");
}

function loadBrain(brainJson) {
    population = new Population(populationSize);
    let brain = Brain.prototype.deserialize(brainJson);
    population.loadBrain(brain);
}

function decreasePopulation() {
    populationSize -= 100;
    if (populationSize < 100)
        populationSize = 100;
}

function increasePopulation() {
    populationSize += 100;
    if (populationSize > 5000)
        populationSize = 5000;
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
}