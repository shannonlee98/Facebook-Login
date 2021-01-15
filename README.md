# Scratch
User signup and login with encryption and Facebook authentication.

1. git clone repo into project folder
2. cd into project folder
3. run npm install
4. in folder scratch/config create new file module.js
5. copy and paste the following in module.js:
    
    module.exports = {
      host: "localhost",
      user: "root",
      password: "",
      database: ""
    };
    
6. create a mySql database and fill up the password and database name in module.js
7. in mySql database, copy and paste the CREATE TABLE command from database.sql to the mySql terminal
8. run nodemon server.js or node server.js
9. open http://localhost:8080 in web browser
