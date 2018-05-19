var inquirer = require("inquirer");
var conn = require("./connection");
var product = require("./products");

var User = {
    //Prompt User Login or Create New Account Function
    loginPrompt: function () {
        inquirer.prompt ([
        {
            type: "list",
            message: "Please Choose Below Options?",
            choices: ["Login", "Create New Account"],
            name: "loginChoice"
        }]).then (function (choice) {
            if (choice.loginChoice === "Login") {
                User.userLogin();
            }
            else if (choice.loginChoice === "Create New Account") {
                User.createNewUser();
            }
        });
    },//End of LoginPrompt

    //Create New User Function
    createNewUser: function () {
        inquirer.prompt ([
            {
                type: "input",
                message: "User Name: ",
                name: "userName"
            },
            {
                type: "password",
                message: "Password: ",
                name: "userPassword"
            },
            {
                type: "input",
                message: "First Name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "Last Name: ",
                name: "lastName"
            }
        ]).then (function (user) {
            conn.query(`INSERT INTO users(user_name, password, first_name, last_name, role) 
                        VALUES (?,?,?,?,?)`
                        ,[user.userName, user.userPassword, user.firstName, user.lastName, "Customer"]);
            User.userLogin();   
        });
    },//End of createUsers

    //User Login Function
    userLogin: function () {
        inquirer.prompt ([
            {
                type: "input",
                message: "Please Enter User Name: ",
                name: "userName"
            },
            {
                type: "password",
                message: "Please Enter Password: ",
                name: "userPassword"
            }
        ]).then (function (roleRes) {  
            conn.query(`SELECT * 
                        FROM users 
                        WHERE user_name = ? 
                        AND password = ?`,[roleRes.userName,roleRes.userPassword], function (err, results) {
                if (err) throw err;
    
                if (results.length > 0) {
                    results.forEach(function (el) {
                        if (el.role === "Customer") {
                            console.log("\nCustomer Menu");
                            console.log("-----------------------------------------------------");
                            console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                            product.showProducts(el.user_id);  
                        }
                        else if (el.role === "Supervisor") {
                            console.log("\nSupervisor Menu");
                            console.log("-----------------------------------------------------");
                            console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                            product.supervisorMenu();
                        }
                        else if (el.role === "Manager") {
                            console.log("\nManager Menu");
                            console.log("-----------------------------------------------------");
                            console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                            User.managerMenu(el.user_id);
                        }
                    });
                }
                else {
                    console.log("Login failed! Please try again.");
                    User.userLogin();
                }
            });
        });
    },//End of userLogin

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
                    product.showProducts(userId);
                }
                else if (choice.mgrChoice === "View Low Inventory") {
                    product.viewLowInvItems(userId);
                }
                else if (choice.mgrChoice === "Add to Inventory") {
                    product.addInventory(userId);
                }
                else if (choice.mgrChoice === "Add New Product") {
                    product.addNewProduct(userId);
                }
            });
    }//End of managerMenu 
}//End of User Object


module.exports = User


