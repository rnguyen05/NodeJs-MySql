





/************************* Sales Module **************************************/
// function salesPrompt () {
//     inquirer.prompt ([
//         {
//             type: "input",
//             message: "Please Enter Item Id to Purchase: ",
//             name: "productId"
//         },
//         {
//             type: "input",
//             message: "Please Enter Quantity: ",
//             name: "orderQuantity"
//         }
//     ]).then (function (inquirerResponse) {
        
//         //Check inventory accomondations
//         //If enough inventory then show order summary
//         //Else show insufficient quantity
//         // console.log("YOUR ORDER SUMMARY BELOW");
//         // console.log("------------------------\n");
//         var verifyInventory = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = " + inquirerResponse.productId;
        
//         conn.query(verifyInventory, function (err, resProducts) {
//             if (err) throw err;
            
//             resProducts.forEach(function(element) {
//                 if (element.stock_quantity >= inquirerResponse.orderQuantity) {
//                     element.stock_quantity -= inquirerResponse.orderQuantity;
//                     console.log("Order Details");
//                     console.log("----------------------------------------------");
//                     var orderDetails = new OrderDetails(element.item_id, element.product_name, element.price, inquirerResponse.orderQuantity, userId,element.stock_quantity);
//                     orderDetails.addToOrder(element.item_id, element.product_name, element.price, inquirerResponse.orderQuantity, userId,element.stock_quantity);
//                     //console.log(element.item_id, element.product_name, inquirerResponse.orderQuantity, userId);
//                     //console.log(orderDetails.printItemOrder());
//                     for (var i = 0; i < orderDetails.orderArr.length; i++) {
//                         orderDetails.orderArr[i].printItemOrder();
//                     };
//                     reorderPrompt();
//                 }
//                 else {
//                     console.log("\nSorry! Item Id: " + element.item_id + " - " + element.product_name + " has Insufficient Onhand Quantity.\n");
//                     console.log("Available Inventory: ",element.stock_quantity + "\n");
//                     reorderPrompt();
//                 }
//             }, this); 
//         });
//     });
    
// }//End of salesPrompt

// function reorderPrompt () {
//     inquirer.prompt ([{
//         type: "confirm",
//         message: "Would you like to order again? ",
//         name: "confirmReorder"
//     }]).then (function (reorder) {
//         if (reorder.confirmReorder) {
//             salesPrompt();
//         }
//         else {
//             var OrderDetails = new OrderDetails();
//             OrderDetails.orderSummary(userId);
//             conn.end();
//             return;
//         }
//     });
// }









//Products.showProducts();

// function showProducts () {
//     conn.query("SELECT * FROM products", function (err, res){
//         if (err) throw err;
//         //Columnify package to display all products as table
//         var columns = columnify(res);
//         console.log(columns+"\n");
//         salesPrompt();
//     }); 
// }//End of showProducts






// function LoginPrompt () {
//     inquirer.prompt ([
//         {
//             type: "list",
//             message: "Please Choose Below Options?",
//             choices: ["Login", "Create New User"],
//             name: "loginChoice"
//         }]).then (function (choice) {
//             if (choice.loginChoice === "Login") {
//                 userLogin();
//             }
//             else if (choice.loginChoice === "Create New User") {
//                 createNewUser();
//                 return;
//             }
//         });
// }//End of Login Prompt

// function createNewUser () {
//     inquirer.prompt ([
//         {
//             type: "input",
//             message: "User Name: ",
//             name: "userName"
//         },
//         {
//             type: "password",
//             message: "Password: ",
//             name: "userPassword"
//         },
//         {
//             type: "input",
//             message: "First Name: ",
//             name: "firstName"
//         },
//         {
//             type: "input",
//             message: "Last Name: ",
//             name: "lastName"
//         }
//     ]).then (function (user) {
//         conn.query("INSERT INTO users(user_name, password, first_name, last_name, role) VALUES (?,?,?,?,?)"
//                     ,[user.userName, user.userPassword, user.firstName, user.lastName, "Customer"]);
//         userLogin();   
//     });
// }//End of createUsers

// function userLogin () {
//     inquirer.prompt ([
//         {
//             type: "input",
//             message: "Please Enter User Name: ",
//             name: "userName"
//         },
//         {
//             type: "password",
//             message: "Please Enter Password: ",
//             name: "userPassword"
//         }
//     ]).then (function (roleRes) {  
//         conn.query("SELECT * FROM users WHERE user_name = ? AND password = ?",[roleRes.userName,roleRes.userPassword], function (err, results, fields) {
//             if (err) throw err;

//             if (results.length > 0) {
//                 results.forEach(function (el) {
//                     userId = el.user_id;
//                     console.log("\nCustomer Login");
//                     console.log("-----------------------------------------------------");
//                     console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
//                     if (el.role === "Customer") {
//                         showProducts    ();
//                     }
//                     else if (el.role === "Supervisor") {
//                         console.log("\nSupervisor Login");
//                         console.log("-----------------------------------------------------");
//                         console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
//                     }
//                     else if (el.role === "Manager") {
//                         console.log("\nManager Login");
//                         console.log("-----------------------------------------------------");
//                         console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
//                     }
//                 });
//             }
//             else {
//                 console.log("Login failed! Please try again.");
//                 userLogin();
//             }
//         });
//     });
// }//End of userLogin