var ItemOrder = function (item_id, product_name, unit_price, order_quantity, user_id, OnhandQty) {
    this.item_id = item_id;
    this.product_name = product_name;
    this.unit_price = unit_price;
    this.order_quantity = order_quantity;
    this.user_id = user_id;
    this.OnhandQty = OnhandQty;

    //console.log(this.item_id, this.product_name, this.order_quantity, this.user_id);

    this.printItemOrder = function () {
        var orderItem = "Item Id: " + this.item_id + 
                        "\nProduct Name:  " + this.product_name + 
                        "\nOrder Quantity: " + this.order_quantity +
                        "\nTotal: $" + this.order_quantity * this.unit_price + "\n";
        console.log(orderItem);
    };

};

module.exports = ItemOrder;