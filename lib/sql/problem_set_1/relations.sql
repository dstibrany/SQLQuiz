CREATE TABLE Departments (
    DepartmentID int,
    Name text,

    PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments VALUES
(1, "Dev"),
(2, "Marketing"),
(3, "Sales"),
(4, "Design"),
(5, "Business Development");

CREATE TABLE Employees (
    EmployeeID int,
    DepartmentID int,
    BossID int,
    Name text,
    Salary int,

    PRIMARY KEY (EmployeeID),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    FOREIGN KEY (BossID) REFERENCES Employees(EmployeeID)
);

INSERT INTO Employees VALUES
(1, 1, NULL, "Sheldon", 100000),
(2, 1, 1, "Lenard", 80000),
(6, 3, NULL, "Adama", 200000),
(7, 3, 6, "Apollo", 150000),
(8, 3, 6, "Starbuck", 150000),
(3, 2, 6, "Homer", 60000),
(4, 2, 3, "Bart", 70000),
(5, 2, 3, "Lisa", 50000),
(9, 4, 6, "Jerry", 76000),
(10, 4, 9, "George", 36000),
(11, 4, 9, "Elaine", 42000);