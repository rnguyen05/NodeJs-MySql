var conn = require("./connection.js");
var columnify = require('columnify');
var invItem = require("./invItem.js");
var salesOrder = require("./salesOrder.js");


var Products = function () {

    this.showProducts = function () {
        conn.query("SELECT * FROM products", function (err, res){
            if (err) throw err;
            //Columnify package to display all products as table
            var columns = columnify(res);
            console.log(columns+"\n");
            var salesOrders = new salesOrder();
            salesOrders.salesPrompt();
        }); 
    };
};//End of Products

module.exports = Products;

