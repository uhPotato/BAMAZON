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

// start function where the app begins doing something useful
function start() {

	// First get the data from the database
	// We just want ItemID, ProductName, Price, and StockQuantity
	// Don't need Dept for now
	connection.query('SELECT `ItemID`, `ProductName`, `Price` FROM Products', function(err, res) {

		// if there is an error throw it
		if (err) throw err;

		// display the stock table using the table npm package
		// instructions say to show ItemID, Product name, and Price only
		// so the query above was structured to only fetch these three
		// things for now
		console.table(res);

		inquirer.prompt([{
			// first get the ItemID the user wants
			name: "item",
			type: "input",
			message: "Which ItemID would you like to order?",
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
			// next get the quantity the user wants
			name: "quantity",
			type: "input",
			message: "What quantity would you you like to order?",
			validate: function(value) {

				// check if the user entered a numerical whole number quantity of at least 1
				if (isNaN(value) == false && parseInt(value) >= 1 && value == parseInt(value)) {

					return true;

				} else {

					return "Please enter a whole number quantity of 1 or greater";

				}
			}

		}]).then(function(answer) {
			
			// now that we have a valid ItemID and a quantity, let's call the order function
			// and send it the ItemID and quantity
			order(answer.item, answer.quantity);

		})
	})
}

// The order function receives item and quantity and tries to see
// whether order can be placed
function order(itemOrdered, quantityOrdered) {
	
	// query the database for the product by ItemID which is unique
	connection.query('SELECT * FROM Products WHERE ?', {
		ItemID: itemOrdered
	}, function(err, res) {
	
		// if there is an error throw it
		if (err) throw err;

		// check if quantity ordered is in stock
		// since query is returned as array always, and we are
		// looking at a unique ItemID, just reference array index 0
		if (res[0].StockQuantity >= quantityOrdered) {
	
			// quantity ordered is available
			// run successful order function
			successfulOrder(itemOrdered, quantityOrdered);
	
		} else {
	
			// quanity ordered is not available
			// run failed order function
			failedOrder(res[0].ProductName, quantityOrdered, res[0].StockQuantity);
		}
	})
}

// function to run when insufficient quantity and order fails
function failedOrder(productOrdered, quantityOrdered, quantityAvailable) {
	
	// log that we don't have that quantity available of the item
	console.log("\n------------------------------------------------------------------")
	console.log("Sorry!", quantityOrdered, "units of", productOrdered, "not in stock! Only", quantityAvailable, "units available.");
	console.log("------------------------------------------------------------------\n")
	
	// then go back to start
	start();
}

// function to run when sufficient quantity and order can be successful
function successfulOrder(itemOrdered, quantityOrdered) {

	// lets begin by querying the database for the item ordered
	connection.query('SELECT * FROM Products WHERE ?', {
		ItemID: itemOrdered
	}, function(err, res) {

		// if there is an error throw it
		if (err) throw err;

		// save the item unit price
		var unitPrice = res[0].Price;

		// set item name
		var itemName = res[0].ProductName;

		// next let's figure out the new stock quantity
		var newStockQuantity = res[0].StockQuantity - quantityOrdered;

		// new let's update the quantity in the database to reflect the new quantity
		connection.query('UPDATE Products SET ? WHERE ?', [{
			
			// StockQuantity is what we're setting
			StockQuantity: newStockQuantity
		
		}, {
			
			// ItemID (unique) is where we are setting the stock quantity
			ItemID: itemOrdered

		}], function(err, res) {
			
			// trap for errors
			if (err) throw err;

			// now that the stock quantity has been updated, let's display 
			// an order summary as per assignment instructions
			console.log("\n----------------------------------------------")
			console.log("Ordered Summary:");
			console.log(quantityOrdered, "units of", itemName, "at $" + unitPrice + "ea");
			console.log("Total charge: $" + unitPrice * quantityOrdered);
			console.log("----------------------------------------------\n")

			// order was successful, now let's start again 
			start();
		})
		
	})
}