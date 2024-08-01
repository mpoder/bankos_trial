# API Endpoints

## Static Routes

### GET /
- Description: Serves the main chat HTML page
- Response: HTML file

## Message Routes

### GET /messages
- Description: Retrieves all messages
- Authentication: Required
- Response: JSON array of messages sorted by timestamp in ascending order

### POST /messages
- Description: Creates a new message
- Authentication: Required
- Request Body:
  - `content`: String (required)
- Response:
  - Success: JSON object with message "Message created" (Status 201)
  - Error: Missing fields (Status 400) or Server error (Status 500)

## User Routes

### GET /users
- Description: Retrieves all users
- Response: JSON array of users

### POST /users
- Description: Creates a new user
- Request Body:
  - `userName`: String (required)
  - `password`: String (required)
- Response:
  - Success: JSON object with message "User created" and user data (Status 201)
  - Error: Missing fields (Status 400), User already exists (Status 400), or Server error (Status 500)

### GET /presence
- Description: Retrieves online status of users
- Authentication: Required
- Response: JSON array of user presence data including userId, status, and userName

### POST /login
- Description: Authenticates a user and returns a JWT token
- Request Body:
  - `userName`: String (required)
  - `password`: String (required)
- Response:
  - Success: JSON object with JWT token
  - Error: Invalid credentials (Status 401) or Server error (Status 500)
