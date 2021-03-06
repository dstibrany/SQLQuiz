DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS problem_sets;

CREATE TABLE IF NOT EXISTS problem_sets (
    id mediumint NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    num_votes mediumint DEFAULT 0,
    votes_total mediumint DEFAULT 0,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS questions (
    id mediumint NOT NULL AUTO_INCREMENT,
    problem_set_id mediumint NOT NULL,
    question_number int(11) NOT NULL,
    question varchar(255) NOT NULL,
    answer varchar(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (problem_set_id) REFERENCES problem_sets(id)
);
