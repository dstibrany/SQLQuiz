CREATE TABLE IF NOT EXISTS relations (
    id mediumint NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS relationquestionmap (
    id mediumint NOT NULL AUTO_INCREMENT,
    relationid mediumint NOT NULL,
    questionid mediumint NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (relationid) REFERENCES relations(id),
    FOREIGN KEY (questionid) REFERENCES questions(id)
);

INSERT INTO relations (name) VALUES
("Employees"),
("Departments");

INSERT INTO relationquestionmap (relationid, questionid) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(1, 3),
(2, 3),
(1, 4),
(2, 4),
(1, 5),
(2, 5),
(1, 6),
(2, 6);













