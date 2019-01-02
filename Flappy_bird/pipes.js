function Pipes() {
    this.initialize();
}

Pipes.prototype.initialize = function () {
    this.pipes = [];
    this.pipes[0] = new Pipe();
}

Pipes.prototype.show = function () {
    this.pipes.forEach(function (pipe) {
        pipe.show();
    });
}

Pipes.prototype.update = function () {
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

Pipes.prototype.collide = function (bird) {
    for (let i = 0; i < this.pipes.length; i++) {
        if (this.pipes[i].collides(bird)) {
            return true;
        }
    }
    return false;
}
