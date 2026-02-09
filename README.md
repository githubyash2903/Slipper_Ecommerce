# Pahno Jiii - Footwear E-Commerce Platform

Pahno Jiii is a robust, full-stack e-commerce platform designed for selling footwear. It features a modern, responsive frontend and a powerful backend with everything you need to manage your online store.

## Features

### For Customers
- **Seamless Browsing:** A clean and intuitive interface to browse products by category.
- **Easy Shopping:** A simple and secure process for adding items to the cart and wishlist.
- **Secure Checkout:** Integration with Razorpay for a smooth and secure payment experience.
- **Order Tracking:** Customers can view their order history and track the status of their purchases.
- **Personalized Profiles:** Users can manage their personal information and shipping addresses.

### For Admins
- **Centralized Dashboard:** A comprehensive admin panel to manage the entire store.
- **Product Management:** Easily add, edit, and remove products from the catalog.
- **Inventory Control:** Keep track of stock levels and manage inventory effectively.
- **Order Fulfillment:** View and process customer orders efficiently.
- **User and Employee Management:** Manage customer accounts and internal team members.

## Tech Stack

| Category      | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| **Frontend**  | React, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router, Axios   |
| **Backend**   | Node.js, Express, TypeScript, PostgreSQL, Zod, JWT, Razorpay            |
| **Database**  | PostgreSQL                                                              |
| **DevOps**    | Docker (optional, setup not included)                                   |


## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/project-footwear.git
    cd project-footwear
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

The backend requires a set of environment variables to run correctly.

1.  Navigate to the `backend` directory.
2.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
3.  Open the `.env` file and fill in the required values:

    ```env
    # Application Port
    PORT=4000

    # Database Connection
    # Use either individual variables or the DATABASE_URL connection string
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_DATABASE=pahno_jiii_dev
    # DATABASE_URL="postgresql://user:password@host:port/database"

    # JWT Secret for token generation
    JWT_SECRET=your_super_secret_jwt_key

    # Razorpay API Keys
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```

### Running the Application

1.  **Start the backend server:**
    Open a terminal in the `backend` directory and run:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:4000`.

2.  **Start the frontend application:**
    Open another terminal in the `frontend` directory and run:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## Project Structure

### Backend (`/backend`)
- **`/src/controller`**: Handles request/response logic.
- **`/src/database`**: Manages database connection and schema migrations.
- **`/src/middleware`**: Contains middleware for authentication, error handling, etc.
- **`/src/router`**: Defines all API routes.
- **`/src/service`**: Implements the core business logic.
- **`/src/utils`**: Holds utility functions (e.g., JWT, response handlers).
- **`/src/validation`**: Contains Zod schemas for data validation.

### Frontend (`/frontend`)
- **`/src/api`**: Functions for communicating with the backend API.
- **`/src/components`**: Reusable UI components.
- **`/src/context`**: Global state management using React Context.
- **`/src/hooks`**: Custom hooks for shared component logic.
- **`/src/pages`**: Components representing entire pages/routes.
- **`/src/router`**: Defines the application's routing structure.

