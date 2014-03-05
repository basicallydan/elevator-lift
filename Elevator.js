var Arrai = function () {};

Arrai.prototype = Array.prototype;

Arrai.prototype.insert = function (where) {
    var toInsert = Array.prototype.slice.call(arguments, 1);
    toInsert = [where, 0].concat(toInsert);
    this.splice.apply(this, toInsert);
};

function Elevator(floor) {
    this.moving = false;
    this.currentFloor = floor;
    var floorQueue = new Arrai();
    var direction;

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
    }.bind(this);
    
    this.open = function (done) {
        reportStatus('Opening the door.');
        this.moving = false;
        done();
    };
}

function reportStatus () {
    var status = Array.prototype.join.apply(arguments, [' ']);
    var statusBox = document.getElementById('lift-status');
    statusBox.value = status + '\n' + statusBox.value;
}

var lift = new Elevator(1);

// When someone presses the button
//// If there's nobody in the lift, and no other buttons pressed so far, go straight there - DONE
//// If the lift is currently moving towards a floor, put the next floor in the queue