/************ App Flows *****************************************************
1. Run node bamazon.js 
2. Prompt User to Login or Create New Account
3. Display all Inventory Products after User Login
4. Prompt User to input Item Id and Order Quantity
5. Show Order Summary: Item Id, Item Description, Order Quantity, Order $Total
6. Prompt User for another order 
    a. if User choose Yes then repear steps 1 - 5, 
    b. Otherwise, show step 5
7. Exit
------------------- App Back End Flows ------------------
1. User Login
 a. Verify user login against users table.
 b. If login successful, show all inventory items from products table
2. 

*****************************************************************************/

//Require npm packages declarations
var conn = require("./connection.js");
var Users = require("./users.js");

var Users = new Users();

//Invoke user Login Function
Users.LoginPrompt();
