# coinmarket app

## setup

1. clone repo
2. npm install
3. goto /client and npm install
3. rename .env.sample to .env and add credentials for backend
4. use/modify .env given in /client as well for frontend env variables
5. proxy setting is defined in client/package.json
6. refer run project section to run both.


## paths:

1. POST /users/login -> body: ```{email, password }``` to login for local user
2. POST /users/register -> body: ```{email, password, first_name, last_name}``` to register local email user
3. GET /users/auth/facebook -> facebook auth
4. GET /users/auth/google -> google auth
5. GET /users/logout -> logout/clear session/cookies
6. PATCH /users/update:id -> update user same body as /users/register


## run project

1. in root directory start backend server: ```npm start``` (port 3000)
2. goto /client and start frontend on different port ```PORT=3001 npm start```
