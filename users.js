var conn = require("./connection.js");
var Products = require("./products.js");
var inquirer = require("inquirer");
var Products = new Products();

var Users = function () {

    this.LoginPrompt = function () {
        inquirer.prompt ([
            {
                type: "list",
                message: "Please Choose Below Options?",
                choices: ["Login", "Create New User"],
                name: "loginChoice"
            }]).then (function (choice) {
                if (choice.loginChoice === "Login") {
                    var users = new Users();
                    users.userLogin();
                }
                else if (choice.loginChoice === "Create New User") {
                    var users = new Users();
                    users.createNewUser();
                    return;
                }
            });
    };

    this.createNewUser = function () {
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
            conn.query("INSERT INTO users(user_name, password, first_name, last_name, role) VALUES (?,?,?,?,?)"
                        ,[user.userName, user.userPassword, user.firstName, user.lastName, "Customer"]);
            var users = new Users();
            users.userLogin();   
        });
    }//End of createUsers

    this.userLogin = function () {
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
            conn.query("SELECT * FROM users WHERE user_name = ? AND password = ?",[roleRes.userName,roleRes.userPassword], function (err, results, fields) {
                if (err) throw err;
    
                if (results.length > 0) {
                    results.forEach(function (el) {
                        userId = el.user_id;
                        console.log("\nCustomer Login");
                        console.log("-----------------------------------------------------");
                        console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                        if (el.role === "Customer") {
                            Products.showProducts();
                        }
                        else if (el.role === "Supervisor") {
                            console.log("\nSupervisor Login");
                            console.log("-----------------------------------------------------");
                            console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                        }
                        else if (el.role === "Manager") {
                            console.log("\nManager Login");
                            console.log("-----------------------------------------------------");
                            console.log("Welcome " + el.first_name + " " + el.last_name + "!\n");
                        }
                    });
                }
                else {
                    console.log("Login failed! Please try again.");
                    var users = new Users();
                    users.userLogin();
                }
            });
        });
    }//End of userLogin
};//End of Users Constructor

module.exports = Users;
