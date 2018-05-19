var inquirer = require("inquirer");
var conn = require("./connection");
var OrderDetails = require("./orders");
const cTable = require('console.table');

//salesOrder Object
var salesOrder = {
    //Prompt Customer to Enter Order
    salesPrompt: function (userId) {
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
            var verifyInventory = `SELECT item_id, product_name, price, stock_quantity 
                                    FROM products 
                                    WHERE item_id = ` + inquirerResponse.productId;
            
            conn.query(verifyInventory, function (err, resProducts) {
                if (err) throw err;
                
                resProducts.forEach(function(element) {
                    if (element.stock_quantity >= inquirerResponse.orderQuantity) {
                        //If enough inventory then deducting stock based on order quantity
                        element.stock_quantity -= inquirerResponse.orderQuantity;
                        var orderDetails = new OrderDetails(element.item_id, element.product_name, inquirerResponse.orderQuantity, element.price, userId);
                        orderDetails.addToOrder(element.item_id, element.product_name, inquirerResponse.orderQuantity, element.price, userId);
                        for (var i = 0; i < orderDetails.orderArr.length; i++) {
                            orderDetails.orderArr[i].printItemOrder();
                        };
                        orderDetails.updateInventory(element.item_id, element.stock_quantity);
                        salesOrder.reorderPrompt(userId);
                    }
                    else {
                        console.log("\nSorry! Item Id: " + element.item_id + " - " + element.product_name + " has Insufficient Onhand Quantity.\n");
                        console.log("Available Inventory: ",element.stock_quantity + "\n");
                        salesOrder.reorderPrompt();
                    }
                }); 
            });
        });
    },//End of salesPrompt

    //Function prompts to see if customer wants to add more items to order
    reorderPrompt: function (userId) {
        inquirer.prompt ([{
            type: "confirm",
            message: "Would you like to add more item? ",
            name: "confirmReorder"
        }]).then (function (reorder) {
            if (reorder.confirmReorder) {
                //Show inventory items
                conn.query(`SELECT prd.item_id as 'Item Id', prd.product_name as 'Product Name', prd.price as 'Unit Price', 
                            prd.stock_quantity as 'Onhand Quantity', dep.department_name as 'Department'
                            FROM products prd, departments dep WHERE prd.department_id = dep.department_id`, function (err, res){
                    if (err) throw err;
                    console.table(res);
                    //Call salesPrompt function to get order from user
                    salesOrder.salesPrompt(userId);
                }); 
            }
            else {
                //Display Order Summary
                salesOrder.orderSummary(userId);
            }
        });
    },//End of reorderPrompt

    //Order Summary Function
    orderSummary: function (userId) {
        console.log("\n*************** ORDER SUMMARY *************************\n");
        //Get customer's first name and last name
        conn.query(`SELECT first_name, last_name 
                    FROM users 
                    WHERE user_id = ?`, [userId], function (err, res) {
                        if (err) throw err;
                        res.forEach(function(cust) {
                            console.log(`Customer Name: ${cust.first_name} ${cust.last_name}`);
                        }); 
        });
        //Get order total
        conn.query(`SELECT sum(total) as order_total
                    FROM order_details 
                    WHERE customer_id = ? 
                    AND order_status = 'OPEN'`, [userId], function (err, res) {
                        if (err) throw err;
                        res.forEach(function(order) {
                            console.log(`Order Total: $ ${order.order_total}`);
                        }); 
                    console.log("");
        });
        //Get order detail by item
        conn.query(`SELECT  ord.item_id as 'Item Id', prd.product_name as 'Product Name',
                    ord.order_quantity as 'Order Quantity', prd.price as 'Price',
                    ord.total as 'Total'
                    FROM users usr, order_details ord, products prd 
                    WHERE usr.user_id = ord.customer_id 
                    AND prd.item_id = ord.item_id
                    AND usr.user_id = ? 
                    AND ord.order_status = 'OPEN'
                    ORDER BY prd.item_id ASC`,[userId], function (err, res) {
                    if (err) throw err;
                    console.table(res);

                    var orderDetails = new OrderDetails(userId);
                    orderDetails.updateOrderStatus(userId);
                    conn.end();
                    return;
        });
    }//End of OrderSunmary
};//End of salesOrder Object

module.exports = salesOrder;



