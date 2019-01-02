function Pipe() {
    let centerY = random(pipeGapSize, height - pipeGapSize);
    this.x = width;
    this.top = centerY - pipeGapSize / 2;
    this.bottom = centerY + pipeGapSize / 2;
}

Pipe.prototype.show = function () {
    noStroke();
    fill(color(198, 53, 53));
    rect(this.x, 0, pipeWidth, this.top);
    rect(this.x, this.bottom, pipeWidth, height - this.bottom);
}

Pipe.prototype.update = function () {
    this.x -= xSpeed;
}

Pipe.prototype.collides = function (bird) {
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

Pipe.prototype.offScreen = function () {
    if (this.x + pipeWidth < 0) {
        return true;
    }
    return false;
}