Coinmarketcap Tracker

## Setup
1. in root `npm install`
2. go to /client and `npm install`
3. rename `.env.sample` to `.env` and add credentials for backend
4. go to /client and rename `.env.sample` to `.env`
5. proxy setting is defined in client/package.json

## Run app in local
1. in root start backend server`npm start` (port 3000)
2. go to /client and start frontend on different port `PORT=3001 npm start`
3. Open [http://localhost:3001](http://localhost:3001/)

## Paths:
1. POST /users/login -> body: ```{email, password }``` to login for local user
2. POST /users/register -> body: ```{email, password, first_name, last_name}``` to register local email user
3. GET /users/auth/facebook -> facebook auth
4. GET /users/auth/google -> google auth
5. GET /users/logout -> logout/clear session/cookies
6. PATCH /users/update:id -> update user same body as /users/register