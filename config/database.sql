-- Create a new database called 'mydb'
CREATE DATABASE mydb;

-- Create a new table called 'users' in schema 'mydb'
DROP TABLE IF EXISTS user;
-- Create the table in the specified schema
CREATE TABLE user
(
    userid INT AUTO_INCREMENT PRIMARY KEY, -- primary key column
    localEmail VARCHAR (255),
    password VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255),
    gender VARCHAR(10),
    birthday VARCHAR(255)
    -- specify more columns here
);

-- Insert rows into table 'user'
INSERT INTO user (localEmail, password )
VALUES ( 'shannon@vivita.sg', '1234' ),
        ( 'user@gmail.com', '1234' );
INSERT INTO user ( username, email )
VALUES ( 'test', 'test5@gmail.com' ),
        ( 'test', 'test6@gmail.com' );



-- Update rows in table 'user'
UPDATE user
SET
        localEmail = 'test5@gmail.com',
        password = '1234'
        -- add more columns and values here
WHERE 	email = 'test5@gmail.com';
