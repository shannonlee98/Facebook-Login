-- Create a new table called 'users' in schema 'mydb'
-- Drop the table if it already exists
-- IF OBJECT_ID('mydb.user', 'U') IS NOT NULL
DROP TABLE IF EXISTS mydb.user;
-- Create the table in the specified schema
CREATE TABLE mydb.user
(
    userid INT AUTO_INCREMENT PRIMARY KEY, -- primary key column
    email VARCHAR (255),
    password VARCHAR(255),
    FBemail VARCHAR(255),
    username VARCHAR(255),
    gender VARCHAR(10),
    birthday VARCHAR(255)
    -- specify more columns here
);

-- Insert rows into table 'user'
INSERT INTO user ( username, email, password )
VALUES ( 'test', 'test@gmail.com', '1234' ),
        ( 'user', 'user@gmail.com', '1234' );