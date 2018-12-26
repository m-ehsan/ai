function displayUI() {
    noStroke();
    textSize(30);
    textStyle(BOLD);
    fill(color(20, 114, 55));
    text("Generation: " + population.generation, 120, 150);
    textSize(22);
    text("steps: " + ((population.bestStep == Infinity) ? '-' : population.bestStep), 120, 210);
    text("[up/down] mutation rate: " + nf(mutationRate, 0, 3), 120, 260);
}

function displayFPS() {
    fill(color(30, 180, 40));
    strokeWeight(0.5);
    stroke(0);
    textSize(14);
    textAlign(LEFT, TOP);
    var fps = Math.round(frameRate());
    text(fps + " fps", 0, 0);
}

function handleMutationRateChange() {
    if (keyIsDown(UP_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            mutationRate += 0.01;
        }
        else {
            if (frameCount % 4 == 0)
                mutationRate += 0.001;
        }
        if (mutationRate > 1)
            mutationRate = 1;
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            mutationRate -= 0.01;
        }
        else {
            if (frameCount % 4 == 0)
                mutationRate -= 0.001;
        }
        if (mutationRate < 0.001)
            mutationRate = 0.001;
    }
}