# Ban Kos test work

## About

This is a basic chat application prototype utilizing the following technologies:

- `mongoose` as the database.
- `express` as the server
- `jwt` for authentication
- `socket.io` for real-time communication using websockets

Project was tested against an online MongoDB instance on cloud.mongodb.com.

The three assignments are combined into one in this repo:

### 1st subtask

The /users endpoint should return a list of all users in the database.

### 2nd subtask

Registration is possible using the POST /users route with providing a userName and password in a x-www-form-urlencoded form.
Logging in is possible using the POST /login route with providing a userName and password in a x-www-form-urlencoded form.
POST /messages, GET /messages and GET /presence endpoints require authentication.

### 3rd subtask

The root route (/) offers a web interface for a basic chat application using socket.io. Chat messages are saved to the database and also retrieved on log-in or refresh.

## Functionality

- Users can register and login to the application (registering only using the API endpoint)
- Connection to a MongoDB database
- Real-time communication using websockets
- Endpoints for users and messages
- JWT authentication
- Routes that require authentication (POST messages, GET messages and GET presence)
- Basic HTML chat interface
- Basic HTML login interface
- Basic authentication interface
- Super-basic message history
- Basic user presence status

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
