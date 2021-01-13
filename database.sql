-- Create a new table called 'users' in schema 'mydb'
-- Drop the table if it already exists
-- IF OBJECT_ID('mydb.user', 'U') IS NOT NULL
DROP TABLE IF EXISTS mydb.user;
-- Create the table in the specified schema
CREATE TABLE mydb.user
(
    userId INT AUTO_INCREMENT PRIMARY KEY, -- primary key column
    email NVARCHAR (255) NOT NULL,
    password NVARCHAR(255) NOT NULL
    -- specify more columns here
);
