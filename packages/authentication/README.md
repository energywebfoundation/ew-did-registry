## Authentication
Serves as reference for DID-based authentication

### Overview

Example application consists of two parts - a client and a server, requests to 
which must be authenticated. Server is an Express.js application. All requests 
to the server except the request to `/login` are processed by the application 
level middleware which checks for json web token signed by the server in the 
request header. In case of unsuccessful verification, the user is redirected to 
the login page.
During authentication, the user makes a POST request to `/login` and in the 
request body passes authentication claim. Server sequentially:

1. Verifies the claim signature
2. Verifies that the signer is a controller or delegate of authenticating identity
3. The claim is intended for authentication on this resource
4. The claim has not expired

In case of successful verification, the token is returned to the user, which is
used in subsequent requests. All DID-related operations are performed using a 
resolver that is selected based on the DID method extracted from the DID of 
authentificating identity. 
The client is a React application. For authentication, the utils folder exposes
the `sendAuthClaim` function, which returns the authentication result and token
in case of success. User status and token are stored in redux store and are used
for requests to protected resources

### How to use

To start the client run `npm run start-rpc` from the `authentication/client` 
folder, which also starts the test blockchain. To start the server, run 
`npm run start` from `authentication/server`

