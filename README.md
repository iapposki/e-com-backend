# E-Commerce Backend
This is a backend application for an e-commerce website built using Node.js, Express, Prisma and PSQL. It provides endpoints for managing sellers, products, orders, user/seller creation and authentication, otp verification etc.
## Getting Started
To get started with this project, you'll need to clone the repository to your local machine and have docker installed. Setup up the container stack using the following command : 
```
docker compose up
```
In the server container, run the following command to migrate the db :
```
npx prisma migrate dev
```

## Endpoints
This application provides the following endpoints:
### Sellers
- POST `/seller` - create a new seller
- DELETE `/seller` - delete a seller
- GET `/seller` - get all sellers
- PUT `/seller` - update a seller
### Products
- POST `/seller/:sellerId/product` - create a new product
- GET `/products` - get all products
- DELETE `/product` - delete a product
### OTP Verification
- POST `/otp` - create a new OTP
- POST `/validateotp` - validate an OTP
- POST `/resendotp` - resend an OTP
### User Authentication
- POST `/auth/signup` - create a new user
- GET /auth/signup/verify - verify a user (requires authentication)
- POST /auth/login - authenticate a user
- POST /auth/forgotpassword - send a password reset email
- POST /auth/resetpassword - reset a user's password (requires authentication)
### Orders
- POST /order - create a new order

## Middleware
This application uses `authenticate` which validates JWT token for authentication. The technique used here for secure authentication is access and rotated refresh token.


