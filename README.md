# API Documentation

Parameters are sent as form URL-encoded format.

Responses are sent as JSON-encoded objects.

## POST /api/signup

Parameters:
    username: String
    email: String
    password: String

Response:
    accessToken: String
    expiresIn: Number


## POST /api/login

Parameters:
    usernameOrEmail: String
    password: String


## GET /api/self:

Response:
    id: String
    username: String
    email: String
