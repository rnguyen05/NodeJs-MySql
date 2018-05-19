var ItemOrder = require("./ItemOrder");
var conn = require("./connection");

var OrderDetails = function (item_id, product_name, order_quantity, unit_price, user_id) {
    this.orderArr = [];
    this.addToOrder = function (item_id, product_name, order_quantity, unit_price, user_id) {
        this.orderArr.push(new ItemOrder(item_id, product_name, order_quantity, unit_price, user_id));
        var total = this.orderArr.map(ItemOrder=>ItemOrder.total)[0];
        conn.query(`INSERT INTO order_details(item_id, order_quantity, customer_id, total, order_status) 
                    VALUES (?,?,?,?,?)`, [item_id, order_quantity, user_id, total, 'OPEN'], function (err) {
            if (err) throw err;
        });
    };
    //Update Inventory as soon as order is processed
    this.updateInventory = function (item_id, stock_quantity) {
        conn.query(`UPDATE products 
                    SET stock_quantity = ? 
                    WHERE item_id = ?`,[stock_quantity, item_id], function (err) {
            if (err) throw err;
        });
    };
    //Update order status to "CLOSED" upon customer logout 
    //(Assumed order is processed from ORDER to SHIP to CLOSED)
    this.updateOrderStatus = function (user_id) {
        conn.query(`UPDATE order_details 
                    SET order_status = ? 
                    WHERE customer_id = ?`,['CLOSED', item_id, user_id], function (err) {
            if (err) throw err;
        });
    };  
};


module.exports = OrderDetails;