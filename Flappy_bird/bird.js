function Bird(brain) {
    if (brain instanceof NeuralNetwork) {
        this.brain = brain.copy();
    }
    else {
        this.brain = new NeuralNetwork(5, 8, 1);
    }
    this.y = height / 2;
    this.velocity = 0;
    this.dead = false;
    this.isBest = false;
    this.isPlayer = false;
    this.score = 0;
    this.fitness = 0;
}

Bird.prototype.show = function () {
    strokeWeight(1);
    stroke(50, 80);
    if (this.isBest) {
        fill(color(40, 160, 30));
    }
    else {
        if (this.isPlayer)
            fill(color(53, 135, 198));
        else
            fill(color(53, 135, 198, 80));
    }
    ellipse(birdX, this.y, birdRadius * 2, birdRadius * 2);
}

Bird.prototype.up = function () {
    this.velocity = -birdUpSpeed;
}

Bird.prototype.think = function () {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipeCollection.pipes.length; i++) {
        let diff = (pipeCollection.pipes[i].x + pipeWidth) - (birdX - birdRadius / 2);
        if (diff > 0 && diff < record) {
            record = diff;
            closest = pipeCollection.pipes[i];
        }
    }

    if (closest != null) {
        let inputs = [];
        inputs[0] = map(closest.x - (birdX + birdRadius / 2), 0, width, 0, 1);
        inputs[1] = map((this.y - birdRadius / 2) - closest.top, 0, height, 0, 1);
        inputs[2] = map(closest.bottom - (this.y + birdRadius / 2), 0, height, 0, 1);
        inputs[3] = map(this.y, 0, height, 0, 1);
        inputs[4] = map(this.velocity, -20, 20, 0, 1);

        let action = this.brain.predict(inputs);
        if (action[0] > 0.5) {
            this.up();
        }
    }
}

Bird.prototype.move = function () {
    this.velocity += gravityAccel;
    this.y += this.velocity;
}

Bird.prototype.collides = function () {
    if (this.y + birdRadius > height || this.y - birdRadius < 0) // hits floor or ceiling
        return true;
    return pipeCollection.collide(this); // hits a pipe
}

Bird.prototype.update = function () {
    if (!this.dead) {
        this.move();
        if (this.collides()) {
            this.dead = true;
        }
        else {
            this.score++;
        }
    }
}

Bird.prototype.setLearningRate = function (rate) {
    this.brain.setLearningRate(rate);
}

Bird.prototype.mutate = function () {
    this.brain.mutate(mutate);
}

Bird.prototype.copy = function () {
    return new Bird(this.brain);
}

function mutate(x) {
    if (random(1) < mutationRate) {
        let offset = randomGaussian() * 0.5;
        let newX = x + offset;
        return newX;
    }
    return x;
}