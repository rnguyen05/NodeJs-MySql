var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("\n");
});

module.exports = conn;