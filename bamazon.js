/************ App Flows *****************************************************
1. Run node bamazon.js from terminal
2. Prompt User to Login or Create New Account
3. If Login is:

    I. Customer
        a. List all products for sales
        b. Prompt to get customer purchase by item id and quantity
        c. Display order item on screen to customer
        d. Ask if customer wants to add more items to order. If customer response
            - Y (Yes) : Repeat steps a -> d
            - N (No) : Show customer's order summary

    II. Manager
        * Display Manager Menu Options 
            - View Products for Sale by
                . Input: Department
                . Input: Item Id
                . Input: Customer
            - View Low Inventory
                . Input: Number
            - Add to Inventory
                . Input: Item Id, Quantity 
            - Add New Product 
                . Input: Product Name, Price, Stock Quantity, Department
    
    III. Supervisor
        * Display Supervisor Menu Options
            - View Products for Sale by
                . Input: Department
                . Input: Item Id
                . Input: Customer
            - Create New Department
                . Input: Department Name, Over Head Costs

4. Files Used: 
    - Main File: bamazon.js
    - Sales Order: salesOrder.js
    - User Management: users.js
    - Order Details: orders.js 
    - Inventory: products.js
    - Print Item Ordered: ItemOrder.js
    
*****************************************************************************/

//Require npm packages declarations
var conn = require("./connection");
var User = require("./users");

User.loginPrompt();
