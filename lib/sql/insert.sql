CREATE TABLE IF NOT EXISTS modules (
    id mediumint NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS relations (
    id mediumint NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS relationmodulemap (
    id mediumint NOT NULL AUTO_INCREMENT,
    module_id mediumint NOT NULL,
    relation_id mediumint NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (module_id) REFERENCES modules(id),
    FOREIGN KEY (relation_id) REFERENCES relations(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id mediumint NOT NULL AUTO_INCREMENT,
    module_id mediumint NOT NULL,
    question_number int(11) NOT NULL,
    question varchar(255) NOT NULL,
    answer varchar(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (module_id) REFERENCES modules(id)
);

-- module1 data
INSERT INTO modules (name) VALUES
("Jitbit's SQL interview questions");

INSERT INTO relations (name) VALUES
("Employees"),
("Departments");

INSERT INTO relationmodulemap (module_id, relation_id) VALUES
(1, 1),
(1, 2);

INSERT INTO questions (module_id, question_number, question, answer) VALUES
(1, 1, "List employees (names) who have a bigger salary than their boss", ""),
(1, 2, "List employees who have the biggest salary in their departments", ""),
(1, 3, "List departments that have less than 3 people in it", ""),
(1, 4, "List all departments along with the number of people there (tricky - people often do an \"inner join\" leaving out empty departments)", ""),
(1, 5, "List employees that don't have a boss in the same department", ""),
(1, 6, "List all departments along with the total salary there", "");

