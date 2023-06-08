var view = {
    displaMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location){    
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}
    ],

    fire: function(guess){
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            // Now we have access to every ship
            var index = ship.locations.indexOf(guess);
            if (index >= 0){
                // We have a hit
                ship.hits[index] = "hit"
                // Tasks for the view
                view.displayHit(guess);
                view.displaMessage("Hit!");
                if(this.isSunk(ship)){
                    view.displaMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        // Tasks for view
        view.displayMiss(guess);
        view.displaMessage("You missed.");
        return false;
    },

    isSunk: function(ship){
        for (var i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do {
                locations = this.generateShip();

            } while(this.collision(locations));

            this.ships[i].locations = locations;
        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        if (direction === 1){
            // Horizontally
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            // Vertically
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];

        for (var i = 0; i < this.shipLength; i++){
            if (direction === 1){
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }

        return newShipLocations;
    },

    collision: function(locations){
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};


var controller = {
    guesses: 0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips){
                view.displaMessage("You sank all my battleships, in " + this.guesses + " guesses.");
                const start = document.createElement("button");
                start.innerText = "Start Game";
                start.id = "start_game";
                const my_board = document.getElementById("board");
                const my_form = document.getElementById("game_form");

                start.addEventListener("click", function() {
                    window.location.reload();
                  });

                my_board.replaceChild(start, my_form);
            }
        }
    },
}

function parseGuess(guess){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
    if (guess === null || guess.length !== 2){
        alert("Ooops, please enter a letter and a number on the board.");
    }else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)){
            alert("Ooops, that isn't on the board.");
        }else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Ooops, that's off the board.");
        }else {
            return row + column;
        }
    }

    return null;
}

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    controller.processGuess(guess);

    guessInput.value = "";
}

window.onload = init;