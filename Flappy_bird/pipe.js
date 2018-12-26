class Pipes {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.pipes = [];
        this.pipes[0] = new Pipe();
    }

    show() {
        this.pipes.forEach(pipe => {
            pipe.show();
        });
    }

    update() {
        let lastPipeX = 0;
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
            if (this.pipes[i].x > lastPipeX)
                lastPipeX = this.pipes[i].x;
            if (this.pipes[i].offScreen()) {
                this.pipes.splice(i, 1);
            }
        }

        // add new pipe
        if (width - lastPipeX - pipeWidth > pipesDistance) {
            this.pipes.push(new Pipe());
        }
    }

    collide(bird) {
        for (let i = 0; i < this.pipes.length; i++) {
            if (this.pipes[i].collides(bird)) {
                return true;
            }
        }
        return false;
    }
}

class Pipe {
    constructor() {
        let centerY = random(pipeGapSize, height - pipeGapSize);
        this.x = width;
        this.top = centerY - pipeGapSize / 2;
        this.bottom = centerY + pipeGapSize / 2;
    }

    show() {
        noStroke();
        fill(color(198, 53, 53));
        rect(this.x, 0, pipeWidth, this.top);
        rect(this.x, this.bottom, pipeWidth, height - this.bottom);
    }

    update() {
        this.x -= xSpeed;
    }

    collides(bird) {
        if (birdX + (birdRadius * (1 - collosionTolerance)) > this.x && birdX - (birdRadius * (1 - collosionTolerance)) < this.x + pipeWidth) {
            // hit upper part of the pipe
            if (bird.y - (birdRadius * (1 - collosionTolerance)) < this.top) {
                return true;
            }
            // hit lower part of the pipe
            else if (bird.y + (birdRadius * (1 - collosionTolerance)) > this.bottom)
                return true;
        }
        return false;
    }

    offScreen() {
        if (this.x + pipeWidth < 0) {
            return true;
        }
        return false;
    }
}