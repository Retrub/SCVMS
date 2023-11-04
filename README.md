
# Installing SCVMS project
Clone the SCVMS project repository and navigate to the code directory as shown below:

git clone https://github.com/Retrub/SCVMS.git
SCVMS
You need to install the following dependencies to your package.json file:

# Configuration :
Create a config.env file in the root directory and fill it with the following informations :

PORT=5000

DATABASE_CONNECTION="Your DB URI"

JWT_SECRET="Your JWT Secret key"

JWT_EXPIRE="10min"

# For password Reset :
EMAIL_SERVICE=""

EMAIL_USERNAME=""

EMAIL_PASSWORD=""

EMAIL_FROM=""

 ### Quick Start :
Install dependencies for server & client
npm install && npm run client-install

### Project run
 Run client : npm start
 Run server : npm run server
