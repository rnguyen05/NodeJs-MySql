

//Constructor Function to create invItem
function InvItem (item_id, product_name, department_name, price, stock_quatity) {
    this.item_id = item_id;
    this.product_name = product_name;
    this.department_name = department_name;
    this.price = price;
    this.stock_quatity = stock_quatity;
};

module.exports = InvItem;