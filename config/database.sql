-- Create a new table called 'users' in schema 'mydb'
-- Drop the table if it already exists
-- IF OBJECT_ID('mydb.user', 'U') IS NOT NULL
DROP TABLE IF EXISTS mydb.user;
-- Create the table in the specified schema
CREATE TABLE mydb.user
(
    userid INT AUTO_INCREMENT PRIMARY KEY, -- primary key column
    email VARCHAR (255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FBemail VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birthday VARCHAR(255) NOT NULL,
    -- specify more columns here
);

-- Insert rows into table 'user'
INSERT INTO user ( username, email, password )
VALUES ( 'test', 'test@gmail.com', 'asdf1234' ),
        ( 'user', 'user@gmail.com', 'asdf1234' );