var conn = require("./connection");
var salesOrder = require("./salesOrder");
var inquirer = require("inquirer");
const cTable = require('console.table');


//Products Object
var Products = {
    //Manager Menu Function
    managerMenu: function (userId) {
        inquirer.prompt ([
            {
                type: "list",
                message: "Please Choose Below Options?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                name: "mgrChoice"
            }]).then (function (choice) {
                if (choice.mgrChoice === "View Products for Sale") {
                    Products.showProducts(userId);
                }
                else if (choice.mgrChoice === "View Low Inventory") {
                    Products.viewLowInvItems(userId);
                }
                else if (choice.mgrChoice === "Add to Inventory") {
                    Products.addInventory(userId);
                }
                else if (choice.mgrChoice === "Add New Product") {
                    Products.addNewProduct(userId);
                }
            });
    },//End of managerMenu 

    //Function to show all products
    showProducts: function (userId) {
        conn.query(`SELECT prd.item_id as 'Item Id', prd.product_name as 'Product Name', prd.price as 'Unit Price', 
                    prd.stock_quantity as 'Onhand Quantity', dep.department_name as 'Department'
                    FROM products prd, departments dep 
                    WHERE prd.department_id = dep.department_id
                    ORDER BY prd.item_id, dep.department_name ASC`, function (err, res){
            if (err) throw err;
            console.table(res);
            
            conn.query(`SELECT role
                        FROM users 
                        WHERE user_id = ?`,[userId], function (err, res) {
                            if (err) throw err;
                            res.forEach(function(user) {
                                if (user.role === "Customer") {
                                    salesOrder.salesPrompt(userId);
                                }
                                else if (user.role === "Manager") {
                                    Products.managerMenu(userId);
                                }
                            });   
                        });
        }); 
    },//End of showProducts

    //Function to view low inventory based on Manager's input
    viewLowInvItems: function (userId) {
        inquirer.prompt ([
            {
                type: "input",
                message: "List all items have inventory less than ?",
                name: "lowInvItems"
            }]).then (function (lowInv) {
                
                conn.query(`SELECT prd.item_id as 'Item Id', prd.product_name as 'Product Name', prd.price as 'Unit Price', 
                            prd.stock_quantity as 'Onhand Quantity', dep.department_name as 'Department'
                            FROM products prd, departments dep 
                            WHERE prd.department_id = dep.department_id
                            AND prd.stock_quantity < ?`,[lowInv.lowInvItems] ,function (err, res){
                            if (err) throw err;
                            
                            if (res.length > 0) {
                                console.table (res);
                                Products.managerMenu(userId);
                            }
                            else {
                                console.log("");
                                console.log(`No item has inventory less than ${lowInv.lowInvItems}`);
                                console.log("");
                                Products.managerMenu(userId);
                            }         
            });
        });
    },//End of viewLowInvItems

    //Function to add inventory to existing items
    addInventory: function (userId) {
        inquirer.prompt ([
            {
                type: "input",
                message: "Enter Item Id to Add Inventory: ",
                name: "addInvItem"
            },
            {
                type: "input",
                message: "Enter Quantity: ",
                name: "addInvQty"
            }
        ]).then (function (res) {
                var newStock = 0;
                conn.query("SELECT stock_quantity FROM products WHERE item_id = ?", [res.addInvItem],function (err, resStock) {
                    if (err) throw err;
                    resStock.forEach(function(el) {
                        newStock = el.stock_quantity + parseInt(res.addInvQty);
                    });

                    conn.query(`UPDATE products 
                    SET stock_quantity = ? 
                    WHERE item_id = ?`,[newStock, res.addInvItem], function (err) {
                    if (err) throw err;
                    console.log("Inventory added successfully!");
                    Products.showProducts(userId);
                });
            });
        });
    },//End of addInventory

    //Function to add new item to products table
    addNewProduct: function (userId) {
        inquirer.prompt ([
            {
                type: "input",
                message: "Product Name: ",
                name: "prodName"
            },
            {
                type: "input",
                message: "Price: ",
                name: "itemPrice"
            },
            {
                type: "input",
                message: "Stock Quantity: ",
                name: "itemQty"
            },
            {
                type: "list",
                message: "Department: ",
                choices: ["Electronics", "Books", "Toys", "Women", "Healthcare"],
                name: "department"
            }
        ]).then (function (res) {
                conn.query("SELECT department_id FROM departments WHERE department_name = ?",[res.department], function (err, results) {
                    if (err) throw err;
                    results.forEach(function(el){
                        conn.query("INSERT INTO products (product_name, price, stock_quantity, department_id) VALUES (?,?,?,?)", 
                        [res.prodName, res.itemPrice, res.itemQty, el.department_id],function (err) {
                            if (err) throw err;
                            console.log("Item added successfully!");
                            Products.showProducts(userId);
                        });
                    });
                });
            });
    },//End of addNewProduct

    //Create New Department Function
    createDepartment: function () {
        inquirer.prompt ([
            {
                type: "input",
                message: "Please Enter Department Name: ",
                name: "newDep"
            },
            {
                type: "input",
                message: "Please Enter Over Head Costs: ",
                name: "cost"
            }
        ]).then (function (createDep) {
            conn.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)"
                        , [createDep.newDep, createDep.cost], function (err) {
                if (err) throw err;
                console.log("");
                console.log(createDep.newDep + " Department added successfully!\n");
                inquirer.prompt ([
                    {
                        type: "list",
                        message: "Please Choose Below Options?",
                        choices: ["View Products Sale by", "Create New Department"],
                        name: "spvrChoice"
                    }
                ]).then (function (choice) {
                    if (choice.spvrChoice === "View Products Sale by") {
                        inquirer.prompt ([
                            {
                                type: "list",
                                message: "Please Choose a Category to View",
                                choices: ["Department", "Item", "Customer"],
                                name: "saleByCat"
                            }
                        ]).then (function (err, choice) {
                            console.log(choice);
                        });
                    }
                    else if (choice.spvrChoice === "Create New Department") {
                        product.createDepartment();
                    }
                });
            });
        });
    },//End of createDepartment

    //Sales by Category Function
    salesByCategory: function (cat) {
        console.log("");
        if (cat === "Department") {
            conn.query(`SELECT dep.department_id as 'Department Id' ,dep.department_name as 'Department',
                        dep.over_head_costs as 'Over Head Cost',
                        sum(ord.total) as 'Total Sales',
                        sum(ord.total) - dep.over_head_costs as 'Total Profit'
                        FROM departments dep, order_details ord, products prd
                        WHERE dep.department_id = prd.department_id
                        AND prd.item_id = ord.item_id
                        GROUP BY dep.department_id`, function (err, results) {
                            if (err) throw err;
                            console.table(results);
                            Products.supervisorMenu();
            });
        }
        else if (cat === "Item") {
            conn.query(`SELECT prd.item_id as 'Item Id', prd.product_name as 'Product Name',
                        dep.department_name as 'Department',
                        dep.over_head_costs as 'Over Head Cost',
                        sum(ord.total) as 'Total Sales',
                        sum(ord.total) - dep.over_head_costs as 'Total Profit'
                        FROM departments dep, order_details ord, products prd
                        WHERE dep.department_id = prd.department_id
                        AND prd.item_id = ord.item_id
                        GROUP BY dep.department_id, prd.item_id`, function (err, results) {
                            if (err) throw err;
                            console.table(results);
                            Products.supervisorMenu();
            });
        }
        else if (cat === "Customer") {
            conn.query(`SELECT CONCAT(usr.first_name," ", usr.last_name) as 'Customer', 
                        dep.department_name as 'Department',
                        sum(ord.total) as 'Total Sales'
                        FROM departments dep, order_details ord, products prd, users usr
                        WHERE dep.department_id = prd.department_id
                        AND prd.item_id = ord.item_id
                        AND usr.user_id = ord.customer_id
                        GROUP BY dep.department_id,usr.user_id
                        ORDER BY usr.first_name, usr.last_name, dep.department_name`, function (err, results) {
                            if (err) throw err;
                            console.table(results);
                            Products.supervisorMenu();
            });
        }

    },//End of salesByCategory

    //Supervisor Menu Options Function
    supervisorMenu: function () {
        inquirer.prompt ([
            {
                type: "list",
                message: "Please Choose Below Options?",
                choices: ["View Products Sale by", "Create New Department"],
                name: "spvrChoice"
            }
        ]).then (function (choice) {
            if (choice.spvrChoice === "View Products Sale by") {
                inquirer.prompt ([
                    {
                        type: "list",
                        message: "Please Choose a Category to View",
                        choices: ["Department", "Item", "Customer"],
                        name: "saleByCat"
                    }
                ]).then (function (choice) {
                    if (choice.saleByCat === "Department") {
                        Products.salesByCategory("Department");
                    }
                    else if (choice.saleByCat === "Item") {
                        Products.salesByCategory("Item");
                    }
                    else if (choice.saleByCat === "Customer") {
                        Products.salesByCategory("Customer");
                    }
                });
            }
            else if (choice.spvrChoice === "Create New Department") {
                Products.createDepartment();
            }
        });
    }//End of supervisorMenu 
};

module.exports = Products;

