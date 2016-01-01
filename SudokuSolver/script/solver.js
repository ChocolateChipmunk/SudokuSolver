function ViewModel() {
    var self = this;

    self.cells = [
        new Cell(0, 0, 0),
        new Cell(0, 1, 0),
        new Cell(0, 2, 0),
        new Cell(0, 3, 1),
        new Cell(0, 4, 1),
        new Cell(0, 5, 1),
        new Cell(0, 6, 2),
        new Cell(0, 7, 2),
        new Cell(0, 8, 2),
        new Cell(1, 0, 0),
        new Cell(1, 1, 0),
        new Cell(1, 2, 0),
        new Cell(1, 3, 1),
        new Cell(1, 4, 1),
        new Cell(1, 5, 1),
        new Cell(1, 6, 2),
        new Cell(1, 7, 2),
        new Cell(1, 8, 2),
        new Cell(2, 0, 0),
        new Cell(2, 1, 0),
        new Cell(2, 2, 0),
        new Cell(2, 3, 1),
        new Cell(2, 4, 1),
        new Cell(2, 5, 1),
        new Cell(2, 6, 2),
        new Cell(2, 7, 2),
        new Cell(2, 8, 2),
        new Cell(3, 0, 3),
        new Cell(3, 1, 3),
        new Cell(3, 2, 3),
        new Cell(3, 3, 4),
        new Cell(3, 4, 4),
        new Cell(3, 5, 4),
        new Cell(3, 6, 5),
        new Cell(3, 7, 5),
        new Cell(3, 8, 5),
        new Cell(4, 0, 3),
        new Cell(4, 1, 3),
        new Cell(4, 2, 3),
        new Cell(4, 3, 4),
        new Cell(4, 4, 4),
        new Cell(4, 5, 4),
        new Cell(4, 6, 5),
        new Cell(4, 7, 5),
        new Cell(4, 8, 5),
        new Cell(5, 0, 3),
        new Cell(5, 1, 3),
        new Cell(5, 2, 3),
        new Cell(5, 3, 4),
        new Cell(5, 4, 4),
        new Cell(5, 5, 4),
        new Cell(5, 6, 5),
        new Cell(5, 7, 5),
        new Cell(5, 8, 5),
        new Cell(6, 0, 6),
        new Cell(6, 1, 6),
        new Cell(6, 2, 6),
        new Cell(6, 3, 7),
        new Cell(6, 4, 7),
        new Cell(6, 5, 7),
        new Cell(6, 6, 8),
        new Cell(6, 7, 8),
        new Cell(6, 8, 8),
        new Cell(7, 0, 6),
        new Cell(7, 1, 6),
        new Cell(7, 2, 6),
        new Cell(7, 3, 7),
        new Cell(7, 4, 7),
        new Cell(7, 5, 7),
        new Cell(7, 6, 8),
        new Cell(7, 7, 8),
        new Cell(7, 8, 8),
        new Cell(8, 0, 6),
        new Cell(8, 1, 6),
        new Cell(8, 2, 6),
        new Cell(8, 3, 7),
        new Cell(8, 4, 7),
        new Cell(8, 5, 7),
        new Cell(8, 6, 8),
        new Cell(8, 7, 8),
        new Cell(8, 8, 8)
    ];

    // Set up sibling relationships for each cell
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
            self.cells[i].calculatePossibleValues();
        }
    };

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

