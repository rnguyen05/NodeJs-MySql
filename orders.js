var ItemOrder = require("./ItemOrder.js");
var conn = require("./connection.js");

var OrderDetails = function (item_id, product_name, unit_price,order_quantity, user_id, OnhandQty) {
    this.orderArr = [];
    

    this.addToOrder = function (item_id, product_name, unit_price, order_quantity, user_id, OnhandQty) {
        this.orderArr.push(new ItemOrder(item_id, product_name, unit_price, order_quantity, user_id, OnhandQty));
        
        conn.query("INSERT INTO order_details(item_id, order_quantity, customer_id) VALUES (?,?,?)"
        ,[item_id, order_quantity, user_id], function (err) {
            if (err) throw err;
            conn.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[OnhandQty, item_id], function (err) {
                if (err) throw err;
            });
            //connection.end();
        });
    }; 
    
    this.orderSummary = function (userId) {
        console.log("\nYOUR ORDER SUMMARY BELOW");
        console.log("------------------------\n");
        //connection.end();
    }
};


module.exports = OrderDetails;