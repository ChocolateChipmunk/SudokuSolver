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