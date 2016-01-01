function Cell(row, column, square) {
    var self = this;

    self.row = row;                 // the row this cell is in
    self.column = column;           // the column this cell is in 
    self.square = square;           // the square this cell is in

    self.rowSiblings = [];
    self.columnSiblings = [];
    self.squareSiblings = [];

    self.value = ko.observable();
    self.possibleValues = ko.observableArray([]);

    self.calculatePossibleValues = function () {
        // clear the cell's possible values
        self.possibleValues([]);

        var rowSiblingValues = self.rowSiblings.map(function (obj) {
            return parseInt(obj.value());
        });

        var columnSiblingValues = self.columnSiblings.map(function (obj) {
            return parseInt(obj.value());
        });

        var squareSiblingValues = self.squareSiblings.map(function (obj) {
            return parseInt(obj.value());
        });

        // Only cells whose value is unknown can have "possible values". 
        if (self.value() === undefined || self.value() === "") {
            for (var checkValue = 1; checkValue <= 4; checkValue++) {
                // If none of this cell's siblings contain the check value, then this cell might contain the check value.
                if (rowSiblingValues.indexOf(checkValue) === -1
                        && columnSiblingValues.indexOf(checkValue) === -1
                        && squareSiblingValues.indexOf(checkValue) === -1) {
                    self.possibleValues.push(checkValue);
                }
            }
        }
    }
};