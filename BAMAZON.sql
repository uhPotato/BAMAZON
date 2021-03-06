CREATE DATABASE Bamazon;

CREATE TABLE products;

DROP TABLE products;

USE bamazon;

CREATE TABLE Products(
ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
ProductName VARCHAR(30),
DepartmentName VARCHAR(30),
Price DOUBLE(10,2),
StockQuantity INTEGER);

-- Seed Items into Database
INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Eggs", "grocery", 1.99, 12),
  ("Milk", "grocery", 2.99, 24),
  ("PS3", "electronics", 299.99, 5),
  ("Xbox 360", "electronics", 1479.99, 7),
  ("iPad", "electronics", 399.99, 18),
  ("Bicycle", "sporting goods", 599.99, 2),
  ("Football", "sporting goods", 9.99, 49),
  ("50 Shades of Grey", "books", 9.99, 69),
  ("Game of Thrones", "books", 19.99, 33),
  ("Fight Club", "books", 11.99, 6),
  ("FightClub", "dvds", 13.99, 36),  
  ("Office Space", "dvds", 9.99, 21),
  ("Dark Side of the Moon", "music", 11.55, 15),
  ("Butter", "grocery", 2.99, 12),
  ("Tomato Sauce", "grocery", 2.99, 24),
  ("Switch", "electronics", 299.99, 5),
  ("PC", "electronics", 1479.99, 7),
  ("Galaxy S8", "electronics", 399.99, 18),
  ("Roller Blades", "sporting goods", 599.99, 2),
  ("BasketBall", "sporting goods", 9.99, 49),
  ("Hero With a Thousand Faces", "books", 9.99, 69),
  ("Harry Potter", "books", 19.99, 33),
  ("Ready Player One", "books", 11.99, 6),
  ("Ready Player One", "dvds", 13.99, 36),  
  ("Avengers", "dvds", 9.99, 21),
  ("The Low End Theory", "music", 11.55, 15);

-- View Database Entries
SELECT * FROM Products;


-- ============================ Second Table ============================

CREATE TABLE Departments(
DepartmentID INTEGER AUTO_INCREMENT PRIMARY KEY,
DepartmentName VARCHAR(30),
OverHeadCosts DOUBLE(10,2),
TotalSales DOUBLE(10,2));

-- Seed Departments into Database
INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales)
VALUES ("grocery", 10500.00, -10000.00), -- More fun stuff (refunds for days!) ;)
  ("electronics", 25000.00, 0.00),
  ("sporting goods", 15000.00, 0.00),
  ("books", 5000.00, 0.00),
  ("dvds", 20000.00, 0.00),
  ("music", 7500.00, 0.00);

-- View Database Entries
SELECT * FROM Departments;

