# Ban Kos test work

## About

This is a basic chat application prototype utilizing the following technologies:

- `mongoose` as the database.
- `express` as the server
- `jwt` for authentication
- `socket.io` for real-time communication using websockets

Project was tested against an online MongoDB instance on cloud.mongodb.com.

## Installation

This project was built with node.js and npm. To install the dependencies, run the following command:

```bash
npm install
```

The project also uses a _.env_ file. This file is _not_ commited to the repository for safety reasons. There is a template of the file, however, named `.env.template`. Here's a quick explanation on all the variables:

- MONGODB_USERNAME - The username for connecting to the MongoDB database
- MONGODB_PASSWORD - The password for connecting to the MongoDB database
- MONGODB_URL - The URL of the MongoDB instance
- MONGODB_APP_NAME - The name of the application in MongoDB
- MONGODB_DB_NAME - The name of the specific database to connect to in MongoDB
- JWT_SECRET - The secret key used for signing and verifying JSON Web Tokens (JWTs) for authentication
