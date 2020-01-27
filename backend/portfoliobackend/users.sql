drop table if exists portfolio_users;

CREATE TABLE portfolio_users (
id int NOT NULL PRIMARY KEY,
first_name varchar(255),
last_name varchar(255),
email varchar(255)
);

INSERT INTO portfolio_users (id, first_name, last_name, email)
values (1, 'Zach', 'Alexander', 'alexander.d.zachary@gmail.com');
INSERT INTO portfolio_users (id, first_name, last_name, email)
values (2, 'Katie', 'Friedman', 'katherine.a.friedman@gmail.com');
INSERT INTO portfolio_users (id, first_name, last_name, email)
values (3, 'Ruggles', 'Friedman-Alexander', 'ruggles@gmail.com');
INSERT INTO portfolio_users (id, first_name, last_name, email)
values (4, 'John', 'Baimas', 'jbaimas@gmail.com');
INSERT INTO portfolio_users (id, first_name, last_name, email)
values (5, 'Nick', 'Alexander', 'nichalexander6@gmail.com');