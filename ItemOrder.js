

//Constructor Function ItemOrder
var ItemOrder = function (item_id, product_name, order_quantity, unit_price, user_id, order_id){
    this.item_id = item_id;
    this.product_name = product_name;
    this.order_quantity = order_quantity;
    this.unit_price = unit_price;
    this.user_id = user_id;
    this.order_id = order_id;
    this.total = Math.round((this.order_quantity * this.unit_price)*100)/100;
    
    //Constructor Function to print per item ordered
    this.printItemOrder = function () {
        console.log("Order Item");
        console.log("----------------------------------------------");
        var orderItem = "Item Id: " + this.item_id + 
                        "\nProduct Name:  " + this.product_name + 
                        "\nOrder Quantity: " + this.order_quantity +
                        "\nTotal: $" + Math.round((this.order_quantity * this.unit_price)*100)/100 + "\n";
        console.log(orderItem);
    };
};

module.exports = ItemOrder;