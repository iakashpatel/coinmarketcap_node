# coinmarket app

## setup

1. clone repo
2. npm install
3. rename .env.sample to .env and add credentials
4. npm start

## paths:

1. POST /users/login -> body: ```{email, password }``` to login for local user
2. POST /users/register -> body: ```{email, password, first_name, last_name}``` to register local email user
3. GET /users/auth/facebook -> facebook auth
4. GET /users/auth/google -> google auth
5. GET /users/logout -> logout/clear session/cookies
