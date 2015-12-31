function Cell(row, column, square) {
    var self = this;

    self.value = ko.observable();
    self.row = row;                 // the row this cell is in
    self.column = column;           // the column this cell is in 
    self.square = square;           // the square this cell is in

    self.rowSiblings = [];
    self.columnSiblings = [];
    self.squareSiblings = [];

    self.possibleValues = ko.observableArray([]);
};

function ViewModel() {
    var self = this;

    self.cells = [new Cell(0, 0, 0),
        new Cell(0, 1, 0),
        new Cell(0, 2, 1),
        new Cell(0, 3, 1),
        new Cell(1, 0, 0),
        new Cell(1, 1, 0),
        new Cell(1, 2, 1),
        new Cell(1, 3, 1),
        new Cell(2, 0, 2),
        new Cell(2, 1, 2),
        new Cell(2, 2, 3),
        new Cell(2, 3, 3),
        new Cell(3, 0, 2),
        new Cell(3, 1, 2),
        new Cell(3, 2, 3),
        new Cell(3, 3, 3)
    ];

    // These member values are used to store entered values in a convenient format.
    // They are used during calculation of possible values for a given cell.
    self.rows = [[], [], [], []];
    self.columns = [[], [], [], []];
    self.squares = [[], [], [], []];

    for (var i = 0; i < self.cells.length; i++) {
        var cell = self.cells[i];

        // This function needs to be called any time a cell's value is updated
        cell.value.subscribe(function (newValue) {
            // When the value of a cell changes, the new cell value must be added to the row, column, and square that the cell belongs to.
            self.rows[this.row].push(newValue);
            self.columns[this.column].push(newValue);
            self.squares[this.square].push(newValue);
        }, self.cells[i]);

        cell.columnSiblings = self.cells.filter(function (value) {
            return value.column === cell.column && value !== cell;
        });

        cell.rowSiblings = self.cells.filter(function (value) {
            return value.row === cell.row && value !== cell;
        });

        cell.squareSiblings = self.cells.filter(function (value) {
            return value.square === cell.square && value !== cell;
        });
    }

    self.calculateAllPossibleValues = function () {
        for (var i = 0; i < self.cells.length; i++) {
            var cell = self.cells[i];
            self.calculatePossibleValues(cell);
        }
    };

    self.calculatePossibleValues = function (cell) {
        // clear the cell's possible values
        cell.possibleValues([]);

        // Only cells whose value is unknown can have "possible values". 
        if (cell.value() === undefined) {
            for (var checkValue = 1; checkValue <= 4; checkValue++) {
                // If none of this cell's siblings contain the check value, then this cell might contain the check value.
                if (self.rows[cell.row].indexOf(checkValue) === -1
                        && self.columns[cell.column].indexOf(checkValue) === -1
                        && self.squares[cell.square].indexOf(checkValue) === -1) {
                    cell.possibleValues.push(checkValue);
                }
            }
        }
    }

    self.setApparent = function () {
        var setAnyValues = false;

        for (var i = 0; i < self.cells.length; i++) {
            var cell = self.cells[i];

            // If the cell only has one possible value, then it must be the cell's actual value.
            if (cell.possibleValues().length === 1) {
                cell.value(cell.possibleValues()[0]);
                cell.possibleValues([]);
                setAnyValues = true;
            }
        }

        return setAnyValues;
    };

    self.setSibling = function () {
        var setAnyValues = false;

        for (var i = 0; i < self.cells.length; i++) {
            var cell = self.cells[i];

            // Compare each cell's possible values to its sibling cells' possible values (row, column, square).
            for (var j = 0; j < cell.possibleValues().length; j++) {
                var value = cell.possibleValues()[j];
                
                var matchFound = false;

                for (var k = 0; k < cell.rowSiblings; k++) {
                    if (cell.rowSiblings[k].possibleValues().indexOf(value) > -1) {
                        matchFound = true;
                        break;
                    }
                }

                // If none of the other cells in a sibling group can contain a given value, then it must be the value of the cell under consideration.
                if (!matchFound) {
                    cell.value(value);
                    cell.possibleValues([]);
                    setAnyValues = true;
                    break;
                }

                matchFound = false;

                for (var k = 0; k < cell.rowSiblings; k++) {
                    if (cell.columnSiblings[k].possibleValues().indexOf(value) > -1) {
                        matchFound = true;
                        break;
                    }
                }

                // If none of the other cells in a sibling group can contain a given value, then it must be the value of the cell under consideration.
                if (!matchFound) {
                    cell.value(value);
                    cell.possibleValues([]);
                    setAnyValues = true;
                    break;
                }

                matchFound = false;

                for (var k = 0; k < cell.rowSiblings; k++) {
                    if (cell.squareSiblings[k].possibleValues().indexOf(value) > -1) {
                        matchFound = true;
                        break;
                    }
                }

                // If none of the other cells in a sibling group can contain a given value, then it must be the value of the cell under consideration.
                if (!matchFound) {
                    cell.value(value);
                    cell.possibleValues([]);
                    setAnyValues = true;
                    break;
                }
            }
        }

        return setAnyValues;
    };
};

var vm = new ViewModel();
vm.cells[0].value(1);
vm.cells[1].value(2);
vm.cells[2].value(3);
vm.cells[5].value(3);
vm.cells[10].value(1);
vm.cells[12].value(3);

ko.applyBindings(vm);