var inquirer = require("inquirer");
var conn = require("./connection.js");
var Products = require("./products.js");
var OrderDetails = require("./orders.js");

var orderSummary = [];
var Products = new Products();

var salesOrder = function () {
    this.salesPrompt = function () {
        inquirer.prompt ([
            {
                type: "input",
                message: "Please Enter Item Id to Purchase: ",
                name: "productId"
            },
            {
                type: "input",
                message: "Please Enter Quantity: ",
                name: "orderQuantity"
            }
        ]).then (function (inquirerResponse) {
            //Check to see if there is enough inventory
            var verifyInventory = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = " + inquirerResponse.productId;
            
            conn.query(verifyInventory, function (err, resProducts) {
                if (err) throw err;
                
                resProducts.forEach(function(element) {
                    if (element.stock_quantity >= inquirerResponse.orderQuantity) {
                        element.stock_quantity -= inquirerResponse.orderQuantity;
                        console.log("Order Details");
                        console.log("----------------------------------------------");
                        var orderDetails = new OrderDetails(element.item_id, element.product_name, element.price, inquirerResponse.orderQuantity, userId,element.stock_quantity);
                        orderDetails.addToOrder(element.item_id, element.product_name, element.price, inquirerResponse.orderQuantity, userId,element.stock_quantity);
                        //console.log(element.item_id, element.product_name, inquirerResponse.orderQuantity, userId);
                        //console.log(orderDetails.printItemOrder());
                        for (var i = 0; i < orderDetails.orderArr.length; i++) {
                            orderDetails.orderArr[i].printItemOrder();
                        };
                        var salesOrders = new salesOrder();
                        salesOrders.reorderPrompt();
                    }
                    else {
                        console.log("\nSorry! Item Id: " + element.item_id + " - " + element.product_name + " has Insufficient Onhand Quantity.\n");
                        console.log("Available Inventory: ",element.stock_quantity + "\n");
                        var salesOrders = new salesOrder();
                        salesOrders.reorderPrompt();
                    }
                }, this); 
            });
        });
    };//End of salesPrompt

    this.reorderPrompt = function () {
        inquirer.prompt ([{
            type: "confirm",
            message: "Would you like to add more item? ",
            name: "confirmReorder"
        }]).then (function (reorder) {
            if (reorder.confirmReorder) {
                Products.showProducts();
                var salesOrders = new salesOrder();
                salesOrders.salesPrompt();
            }
            else {
                //Display Order Summary
                conn.end();
                return;
            }
        });
    };//End of reorderPrompt

    this.orderSummary = function () {

    };//End of orderSummary
};

module.exports = salesOrder;



