INSERT INTO problem_sets (name, rating) VALUES
("Jitbit's SQL interview questions", "medium");

INSERT INTO questions (problem_set_id, question_number, question, answer) VALUES
(1, 1, "List employees (names) who have a bigger salary than their boss", "select e1.name from employees e1 where salary > (select e2.salary from employees e2 where salary > (select e2.salary from employees e2 where e2.EmployeeID = e1.BossID)"),
(1, 2, "List employees who have the biggest salary in their departments", ""),
(1, 3, "List departments that have less than 3 people in it", ""),
(1, 4, "List all departments along with the number of people there (tricky - people often do an \"inner join\" leaving out empty departments)", ""),
(1, 5, "List employees that don't have a boss in the same department", ""),
(1, 6, "List all departments along with the total salary there", "");
