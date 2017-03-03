# Getting Started

//normal setup

npm install

brew update

brew install postgres

postgres -D /usr/local/var/postgres //starts database

createdb savvyshopper

createdb savvyshopper-test

psql postgres

\l //shows databases

psql -d databaseName //connects to the required db

//connect to savvyshopper-test

//drop tables

DROP TABLE categories, experts, preferences, ratings, subcategories, users;

\dt //returns the list of all tables in the database your connected to

\q //quit

mongod

npm start

node ./seed.js

OR node ./server/seed.js from root folder and also feel free to run two or three times as occasionally you may get foreign key constraint error, which ill resolve soon.

//Endpoints For Review

//experts

http://localhost:2300/api/experts

//users

http://localhost:2300/api/users

//messages

http://localhost:2300/api/chat/messages

//get top n active experts of a particular category ordered by average rating

//http://localhost:2300/api/users/topActiveExperts/food
//http://localhost:2300/api/users/topActiveExperts/sports


#Tricks if you're in trouble

//IF you have started the app before

psql

\l //shows databases

psql -d databaseName //connects to the required db

//connect to savvyshopper-test

//drop tables

DROP TABLE categories, experts, preferences, ratings, subcategories, users;


