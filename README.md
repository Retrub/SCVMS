# Installing SCVMS project

Clone the SCVMS project repository and navigate to the code directory as shown below:

git clone https://github.com/Retrub/SCVMS.git
SCVMS

### If you don't have a package.json file in your project, create one by running:

npm init

### Also you need to install the following dependencies to your package.json (server) file:

run command:

npm install bcryptjs cors crypto-js dotenv express jsonwebtoken mongodb mongoose nodemailer nodemon

### In package.json file change this lines to:

"main": "server.js",

"start": "node server.js",

"server": "nodemon server.js"

### In (client) package.json file you need to install this dependencies:

run command:

npm install axios react-router-dom

# Configuration :

### Create a config.env file in the root directory and fill it with the following informations :

PORT=5000

DATABASE_CONNECTION="Your DB URI"

JWT_SECRET="Your JWT Secret key"

JWT_EXPIRE="10min"

# For password Reset :

EMAIL_SERVICE=""

EMAIL_USERNAME=""

EMAIL_PASSWORD=""

EMAIL_FROM=""

# Encryption secret key:

SECRET_KEY_ENCRYPTION = ""

## Project run

Run client : npm start

Run server : npm run server
