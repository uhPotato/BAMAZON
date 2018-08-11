var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create the connection to the database
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "JodahIs100%OP",
	database: "Bamazon"
});

// verify connection to the database
connection.connect(function(err) {

	if (err) {
		// if there is a connection error, log that and throw an error
		console.log("Database connection failed");
		throw err;
	}

	// if connected, then display the threadId for testing
	// console.log("Connected as id: ", connection.threadId);
	
	// begin the meat and potatoes of the app by calling the start function
	start();
})

// function where the program begins running
function start() {
	
	// Provide 4 options to manager
	inquirer.prompt({
		name: "taskToDo",
		type: "rawlist",
		message: "Please select a task:",
		choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product"]
	}).then(function(answer) {

		// once we have manager's selection, run the appropriate function for it
		switch (answer.taskToDo.toUpperCase()) {

			case "VIEW PRODUCTS":
				viewProducts();
				break;

			case "VIEW LOW INVENTORY":
				viewLowInventory();
				break;

			case "ADD INVENTORY":
				addInventory();
				break;

			case "ADD NEW PRODUCT":
				addNewProduct();
				break;

			default:
				console.log("Uh oh! Something went wrong!");
				break;
		}
	})
}

// function to let manager view available stock
function viewProducts() {

	// make database connection and get complete Products table
	connection.query('SELECT * FROM Products', function(err, res) {

		// if there is an error, throw it
		if (err) throw err;

		// display the stock table, but first a new line
		console.log("\n")
		console.table(res);

		// now return to task choices
		start();
	})
}

// function to let manager see low inventory
function viewLowInventory() {

	// make database connection and get products with stock quantity < 5
	connection.query('SELECT * FROM Products WHERE `StockQuantity` < 5', function(err, res) {

		// if there is an error, throw it
		if (err) throw err;

		// display the low stock table, but first a new line
		console.log("\n")
		console.table(res);

		// now return to task choices
		start();
	})
}

// function to let manager add to inventory
function addInventory() {

	// First get the data from the database
	connection.query('SELECT * FROM Products', function(err, res) {

		// if there is an error throw it
		if (err) throw err;

		// display the stock table using the table npm package
		console.table(res);

		inquirer.prompt([{
			// first get the ItemID the manager wants to add to
			name: "item",
			type: "input",
			message: "Enter ItemID for which you would like to add inventory?",
			validate: function(value) {

				// check if ItemID exists within the database
				for (var i=0; i<res.length; i++) {

					// loop through all the items in the table
					// and compare against the ItemID of each
					if (value == res[i].ItemID) {

						return true;
					}
				}

				// after looping through, if ItemID wasn't found
				// then return error/request for for a valid ItemID
				return "Please enter a valid ItemID!";
			}

		}, {
			// next get the quantity the manager wants to add
			name: "quantity",
			type: "input",
			message: "What quantity would you you like to add?",
			validate: function(value) {

				// check if the manager entered a numerical whole number quantity of at least 1
				if (isNaN(value) == false && parseInt(value) >= 1 && value == parseInt(value)) {

					return true;

				} else {

					return "Please enter a whole number quantity of 1 or greater";

				}
			}

		}]).then(function(answer) {

			// create a variable for current (old) stock quantity
			var oldStockQuantity = 0;

			// loop through the table data and get the stock quantity
			// where the ItemID matches the item the manager selected			
			for (var i=0; i < res.length; i++) {
				if (res[i].ItemID == answer.item) {
					oldStockQuantity = res[i].StockQuantity;
				}
			}

			// define newQuantity to be the quantity the manager entered plus
			// the current (old) stock quantity
			var newQuantity = parseInt(answer.quantity) + parseInt(oldStockQuantity);

			// define a variable that holds the ItemID that the manager selected
			var itemIDToAddTo = answer.item;

			// make a query to update the StockQuantity to the newQuantity
			// where the ItemID matches the item the manager selected
			connection.query('UPDATE Products SET ? WHERE ?', [{

				StockQuantity: newQuantity
			}, {
				ItemID: itemIDToAddTo
			}], function(err, res) {

				// trap for error
				if (err) throw err;

				// quantity was added
				console.log("\n----------------------------")
				console.log("Added inventory successfully");
				console.log("----------------------------\n")

				// now that manager has added stock, return to task options opening
				start();
			})

		})
	})
}


// function to let manager add a new product
function addNewProduct() {
	
	// first let's prompt for details on the item the manager wants to add
	inquirer.prompt([{
		// first get the product name
		name: "productName",
		type: "input",
		message: "What is the name of the product you would like to add?"
	}, {
		// next get the department name
		name: "departmentName",
		type: "input",
		message: "In what department does this item belong?"
	}, {
		// next get the price of the item
		name: "productPrice",
		type: "input",
		message: "What is the per unit price of this item?",
		validate: function(value) {

			// check if the manager entered a numerical value greater than 0
			if (isNaN(value) == false && parseInt(value) > 0) {
				return true;
			} else {
				return "Please enter a valid price!";
			}
		}
	}, {
		// finally get the quantity to be added
		name: "productQuantity",
		type: "input",
		message: "What quantity would you like to add?",
		validate: function(value) {
			
			// check if the manager entered a numerical whole number quantity of at least 1
			if (isNaN(value) == false && parseInt(value) >= 1 && value == parseInt(value)) {
				return true;
			} else {
				return "Please enter a whole number quantity of 1 or greater";
			}
		}
	}]).then(function(answer) {

		// now query the database and insert the item data
		connection.query('INSERT INTO Products SET ?', {
			ProductName: answer.productName,
			DepartmentName: answer.departmentName,
			Price: answer.productPrice,
			StockQuantity: answer.productQuantity
		})

		// log out that the item was successfully added
		console.log("\n------------------------");
		console.log("Item successfully added!");
		console.log("------------------------\n");

		// now go back to tasks menu
		start();

	})
}


















