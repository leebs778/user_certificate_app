### Overview:
Full stack (barebones) mini app that handles a few CRUD operations on users & certificates and associations with another.
Uses React for the FE, Node for the BE, and MySQL as the persistence layer. Not the most polished on the frontend, but was able to tinker around with react & following the guidelines set out in `exercise_description.txt` in this repo

### Demo:
You can find a minute long demo of this app in the root of this repo called `demo_of_mini_app.mov`

### Running it locally:
1. `git checkout <this repo>`

#### DB (Assuming you've got MySQL v8.0.11 - Community Server - GPL running)
1. Import the db schema into your running MySql Server located at `./user_certificate_app/backend/db/dump.sql`

#### BE Setup:
1. `cd ./user_certificate_app/backend`
1. `nvm use` (uses node v6.0)
1. `npm install`
1. `DB_HOST='localhost' DB_USER='<db_user>' DB_PWD='<db_pass>' DB_NAME='devel' nodemon app.js`
1. There ya go, you're running on port 3000.

#### FE Setup:
1. `cd ./user_certificate_app/frontend`
1. `npm install`
1. `npm start`
1. Aaaaand you're good! It's running on port 3001 and will be looking for the backend server on port 3000
