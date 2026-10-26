# Multi-Tenant E-Commerce Platform

A full-stack e-commerce application built using React, Node.js, Express, and MongoDB.

## Features

- Super Admin, Vendor, and Customer login
- Product and store management
- Shopping cart and checkout
- Stripe payment integration
- Cloudinary image uploads
- Secure authentication
- MongoDB database

## Technologies Used

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Payments: Stripe
- Image Storage: Cloudinary

## Requirements

Install the following before running the project:

- Node.js and npm
- MongoDB (local installation or MongoDB Atlas account)
- Visual Studio Code

## How to Run

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Make sure MongoDB is running and configure the `MONGO_URI` in your backend environment variables.
5. Configure the required environment variables for authentication, Stripe, and Cloudinary.
6. Start the project:

   ```bash
   npm run dev
   ```

7. Open the local URL displayed in the terminal.

## Database

MongoDB is used by the backend to store users, products, orders, and other application data. You can use a local MongoDB installation or MongoDB Atlas.



