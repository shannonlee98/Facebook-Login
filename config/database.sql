-- Create a new database called 'mydb'
CREATE DATABASE mydb;

USE mydb;

-- Create a new table called 'users' in schema 'mydb'
DROP TABLE IF EXISTS user;
-- Create the table in the specified schema
CREATE TABLE user
(
    userid INT AUTO_INCREMENT PRIMARY KEY, -- primary key column
    localEmail VARCHAR (255),
    password VARCHAR(255),
    fbid VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255),
    gender VARCHAR(10),
    birthday VARCHAR(255)
    -- specify more columns here
);
