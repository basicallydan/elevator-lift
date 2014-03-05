var Arrai = function () {};

Arrai.prototype = Array.prototype;

Arrai.prototype.insert = function (where) {
    var toInsert = Array.prototype.slice.call(arguments, 1);
    toInsert = [where, 0].concat(toInsert);
    this.splice.apply(this, toInsert);
};

var lift;

function Elevator(floor, numberOfFloors) {
    this.moving = false;
    this.currentFloor = floor;
    var floorQueue = new Arrai();
    var direction;

    var setCurrentFloor = function() {
        var floors = document.querySelectorAll(".floor");
        Array.prototype.forEach.call(floors, function(floor) {
            if (+floor.value === this.currentFloor) {
                floor.className = 'floor current';
            } else {
                floor.className = 'floor';
            }
        }.bind(this));
    }.bind(this);

    createFloors(numberOfFloors);

    setCurrentFloor();

    reportStatus('Hello, I am your friendly neighbourhood lift. I am currently at floor', this.currentFloor + '.' ,'Please choose a floor for me to go to.');
    
    this.call = function (fromFloor) {
        reportStatus('Someone at floor', fromFloor, 'needs an elevator');
        if (direction === 'up') {
            if (floorQueue[0] > fromFloor) {
                // Interrupt here
                floorQueue.insert(0, fromFloor);
                reportStatus('Floor', fromFloor, 'can come first. The queue now looks like', floorQueue);
            } else {
                reportStatus('We will get to floor', fromFloor, 'soon.');
                floorQueue.push(fromFloor);
            }
        } else if (direction === 'down') {
            if (floorQueue[0] < fromFloor) {
                // Interrupt here
                floorQueue.insert(0, fromFloor);
                reportStatus('Floor', fromFloor, 'can come first. The queue now looks like', floorQueue);
            } else {
                reportStatus('We will get to floor', fromFloor, 'soon.');
                floorQueue.push(fromFloor);
            }
        } else {
            reportStatus('We will get to floor', fromFloor, 'soon.');
            floorQueue.push(fromFloor);
        }
        
        if (!this.moving) {
            goToNextFloor();
        }
    };
    
    this.goToFloor = function (dropOffFloor) {
        reportStatus('Someone wants to go to floor', dropOffFloor);
        floorQueue.push(dropOffFloor);
        goToNextFloor();
    };
    
    var goToNextFloor = function() {
        if (floorQueue.length === 0) {
            reportStatus('No more floors to go to!');
            return;
        }

        this.moving = true;

        reportStatus('Going from floor', this.currentFloor, 'to floor', floorQueue[0]);
        if (this.currentFloor > floorQueue[0]) {
            reportStatus('Going down!');
            direction = 'down';
            this.currentFloor--;
        } else if (this.currentFloor < floorQueue[0]) {
            reportStatus('Going up!');
            direction = 'up';
            this.currentFloor++;
        }
        
        if (this.currentFloor === floorQueue[0]) {
            reportStatus('We\'ve arrived at', floorQueue[0]);
            floorQueue.shift();
            this.open(function () {
                setTimeout(goToNextFloor, 1500);
            });
        } else {
            setTimeout(goToNextFloor, 500);
        }
        setCurrentFloor();
    }.bind(this);
    
    this.open = function (done) {
        reportStatus('Opening the door.');
        this.moving = false;
        done();
    };
}

function createFloors(n) {
    var shaft = document.getElementById('shaft');
    var b;
    for (var i = n - 1; i >= 0; i--) {
        b = document.createElement('button');
        b.innerText = i === 0 ? 'G' : i;
        b.value = i;
        b.className = 'floor';
        b.onclick = function () {
            lift.call(+this.value);
        };
        shaft.appendChild(b);
    }
}

function reportStatus () {
    var status = Array.prototype.join.apply(arguments, [' ']);
    var statusBox = document.getElementById('lift-status');
    statusBox.innerText = status + '\n' + statusBox.innerText;
}

lift = new Elevator(1, 10);

// When someone presses the button
//// If there's nobody in the lift, and no other buttons pressed so far, go straight there - DONE
//// If the lift is currently moving towards a floor, put the next floor in the queue