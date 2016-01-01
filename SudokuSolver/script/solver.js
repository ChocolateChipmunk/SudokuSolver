﻿function ViewModel() {
    var self = this;

    self.cells = [
        new Cell(0, 0, 0),
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

    for (var i = 0; i < self.cells.length; i++) {
        var cell = self.cells[i];

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

        var rowSiblingValues = cell.rowSiblings.map(function (obj) {
            return obj.value();
        });

        var columnSiblingValues = cell.columnSiblings.map(function (obj) {
            return obj.value();
        });

        var squareSiblingValues = cell.squareSiblings.map(function (obj) {
            return obj.value();
        });

        // Only cells whose value is unknown can have "possible values". 
        if (cell.value() === undefined) {
            for (var checkValue = 1; checkValue <= 4; checkValue++) {
                // If none of this cell's siblings contain the check value, then this cell might contain the check value.
                if (rowSiblingValues.indexOf(checkValue) === -1
                        && columnSiblingValues.indexOf(checkValue) === -1
                        && squareSiblingValues.indexOf(checkValue) === -1) {
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

