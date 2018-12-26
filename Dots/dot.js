class Dot {
    constructor() {
        this.brain = new Brain(instructionsCount);
        this.position = createVector(startX, startY);
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.dead = false;
        this.reachedGoal = false;
        this.isBest = false;
        this.closestDistanceToGoal = Infinity;
        this.closestDistanceToGoalBrainStep = Infinity;
    }

    show() {
        if (this.isBest) {
            stroke(100);
            strokeWeight(1);
            fill(color(40, 160, 30));
            ellipse(this.position.x, this.position.y, dotRadius * 2, dotRadius * 2);
        }
        else {
            noStroke();
            fill(10);
            ellipse(this.position.x, this.position.y, dotRadius, dotRadius);
        }
    }

    move() {
        if (this.brain.step < this.brain.instructions.length) {
            this.acceleration = this.brain.instructions[this.brain.step++];
        }
        else {
            this.dead = true;
        }

        this.velocity.add(this.acceleration);
        this.velocity.limit(5);
        this.position.add(this.velocity);
    }

    update() {
        if (!this.dead && !this.reachedGoal) {
            this.move();

            // reached goal
            if (dist(this.position.x, this.position.y, goalX, goalY) < goalRadius) {
                this.reachedGoal = true;
            }
            // collides screen edges
            else if (this.position.x < dotRadius / 2 ||
                this.position.x > width - dotRadius / 2 ||
                this.position.y < dotRadius / 2 ||
                this.position.y > height - dotRadius / 2
            ) {
                this.dead = true;
            }
            else {
                // collides obstacles
                obstacles.forEach(o => {
                    if (this.position.x > o.x &&
                        this.position.x < o.x + o.width &&
                        this.position.y > o.y &&
                        this.position.y < o.y + o.height
                    ) {
                        this.dead = true;
                    }
                });
            }

            if (!this.dead) {
                let distance = dist(this.position.x, this.position.y, goalX, goalY);
                if (distance < this.closestDistanceToGoal) {
                    this.closestDistanceToGoal = distance;
                    this.closestDistanceToGoalBrainStep = this.brain.step;
                }
            }
        }
    }

    calculateFitness() {
        if (this.reachedGoal) {
            this.fitness = 1 / this.brain.step;
        }
        else {
            this.fitness = 1 / (10000 * this.closestDistanceToGoal);
        }
    }

    copy() {
        let copy = new Dot();
        copy.brain = this.brain.copy();
        return copy;
    }
}