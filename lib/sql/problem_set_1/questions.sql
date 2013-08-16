INSERT INTO problem_sets (name, rating) VALUES
("Jitbit's SQL interview questions", 3.2);

INSERT INTO questions (problem_set_id, question_number, question, answer) VALUES
(1, 1, "List employees (names) who have a bigger salary than their boss.", "select e1.name from employees e1 where salary > (select e2.salary from employees e2 where e2.EmployeeID = e1.BossID)"),
(1, 2, "List employees who have the biggest salary in their departments.", "select e1.name from Employees e1 where e1.salary = (select max(salary) from employees e2 where e1.departmentid = e2.departmentid group by departmentid)"),
(1, 3, "List departments that have less than 3 people in it.", "select d.name from employees e join departments d using(departmentid) group by d.departmentid having count(employeeid) < 3"),
(1, 4, "List all departments along with the number of people there.", "select d.name, count(e.employeeid) from departments d left outer join employees e using (departmentid) group by d.departmentid"),
(1, 5, "List employees that don't have a boss in the same department.", "select name from employees e where e.bossid not in (select e2.employeeid from employees e2 where e2.departmentid = e.departmentid)"),
(1, 6, "List all departments along with the total salary there.", "select d.name, SUM(e.salary) from departments d left outer join employees e using (departmentID) group by d.departmentID");

INSERT INTO problem_sets (name, rating) VALUES
("Easy SQL quiz", 1.0);

INSERT INTO problem_sets (name, rating) VALUES
("Hard SQL quiz", 5.0);

INSERT INTO problem_sets (name, rating) VALUES
("Employees questions set", 2.0);

