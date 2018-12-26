// general
var canvas;
var canvasWidth = 600;
var canvasHeight = 680;
var fps = 60;
var mode = 0; // 0: play game by user    1: training birds
var waitForJump = true;
var showAllBirds = true;
var pause = false;
var cyclesPerFrame = 1; // visual speed of the process
var respawnCoutner = 0; // respawn delay frames

// environment
var gravityAccel = 0.8; // gravity force
var xSpeed = 5;

// birds
var population;
var populationSize = 500; // number of birds
var mutationRate = 0.1;
var birdRadius = 20;
var birdX = 80;
var birdUpSpeed = 11; // speed of bird jumping up

// pipes
var pipeCollection;
var pipeGapSize = 150;
var pipesDistance = 250;
var pipeWidth = 90;
var collosionTolerance = 0.2;

// brains
var goodBrainJSON;

function preload() {
    // load stored brain json file
    goodBrainJSON = loadJSON('brains/35gen-103K.json');
}

function setup() {
    frameRate(fps);
    canvas = createCanvas(canvasWidth, canvasHeight);
    centerCanvas();

    //initialize pipes
    pipeCollection = new Pipes();

    reset();
}

function draw() {
    handleMutationRateChange();
    handleCyclePerFrameChange();
    background(250);

    if (pause) {
        pipeCollection.show();
        population.show();
    }
    else {
        if (mode == 0) { // play mode
            if (respawnCoutner > 0) {
                respawnCoutner--;
                if (respawnCoutner == 0) {
                    reset();
                }
            }
            else {
                if (!waitForJump) {
                    pipeCollection.update();
                    population.update();
                    if (population.allBirdsDead()) {
                        respawnCoutner = 40;
                        waitForJump = true;
                    }
                }
            }
            pipeCollection.show();
            population.show(true);
        }
        else { // train mode
            for (let i = 0; i < cyclesPerFrame; i++) {
                pipeCollection.update();
                if (population.allBirdsDead()) {
                    population.nextGeneration();
                    pipeCollection = new Pipes();
                }
                else {
                    population.think();
                    population.update();
                }
            }
            pipeCollection.show();
            population.show();
        }
    }

    displayUI();
    // displayFPS();
}

function mousePressed() {
    jump();
}

function keyPressed() {
    switch (keyCode) {
        case 32: // Space_bar key
            jump();
            break;
        case 68: // D key
            DownloadBestBrainJson();
        case 76: // L key
            loadBrain(goodBrainJSON);
            break;
        case 77: // M key
            toggleMode();
            break;
        case 80: // P key
            pause = !pause;
            break;
        case 82: // R key
            reset();
            break;
        case 83: // S key
            showAllBirds = !showAllBirds;
            break;
        default:
            break;
    }
}

function reset() {
    pipeCollection = new Pipes();
    if (mode == 0) {
        population = new Population(1);
        population.birds[0].isPlayer = true;
    }
    else {
        population = new Population(populationSize);
    }
}

function jump() {
    if (mode == 0) {
        if (!pause) {
            if (respawnCoutner == 0) {
                waitForJump = false;
                population.birds[0].up();
            }
        }
    }
}

function toggleMode() {
    if (mode == 0)
        mode = 1;
    else
        mode = 0;
    waitForJump = true;
    reset();
}

function DownloadBestBrainJson() {
    saveJSON(population.birds[0].brain, 'gen' + population.generation + '-' + population.highscore + '.json');
}

function loadBrain(brain) {
    population = new Population(populationSize);
    let newBrain = NeuralNetwork.deserialize(brain);
    population.loadBrain(newBrain);
    mode = 1;
    pipeCollection = new Pipes();
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
}