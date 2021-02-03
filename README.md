# Scratch
User signup and login with encryption and Facebook authentication.

1. download the repo: 
    git clone https://github.com/shannonlee98/Scratch.git
    cd Scratch

2. install nodejs by running:
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install node

3. check that nodejs is running and update node:
    node -e "console.log('Running Node.js ' + process.version)"
    npm install

4. install mySql:
    wget -c https://repo.mysql.com//mysql-apt-config_0.8.16-1_all.deb
    sudo dpkg -i ./mysql-apt-config_0.8.16-1_all.deb
    sudo apt-get update
    sudo apt-get install mysql-server
    (you should be prompted to set password for root user)

5. check mysql status and login to mysql shell:
    systemctl status mysql
    mysql -u root -p
    (enter password for root user)

6. open config/database.sql in a text editor, copy lines 1-20, and paste into mysql shell to create the user table

7. exit mysql shell:
    exit

8. create a new file called dbconfig.js in folder scratch/config:
    cd config
    touch dbconfig.js

9. copy and paste the following into dbconfig.js (replace "mypassword" with the password for mysql root user):
    
    module.exports = {
      host: "localhost",
      user: "root",
      password: "mypassword",
      database: "mydb"
    };
    
10. start the server:
    cd {project folder}
    node server.js

11. open http://localhost:8080 in web browser
