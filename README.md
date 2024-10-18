# Client Management API

## Overview

This project is a Client Management API built with Node.js and PostgreSQL. It provides endpoints for managing clients, logging bandwidth usage, and handling admin authentication.

## Table of Contents

- [Client Management API](#client-management-api)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [API Documentation](#api-documentation)
  - [Running the Application](#running-the-application)
  - [Contributing](#contributing)
  - [License](#license)

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Swagger for API documentation
- pgcli for database management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/client-management-api.git
   cd client-management-api
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your PostgreSQL database credentials:

   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   DB_PORT=your_port
   ```

## Database Setup

To set up the database locally, follow these steps:

1. **Create the Database**: Open your PostgreSQL command line or pgcli and create a new database:

   ```sql
   CREATE DATABASE devfest;
   ```

2. **Run the Setup Script**: Execute the import script to create the necessary tables and insert initial data:

   ```bash
   pg_restore -h localhost -U postgres -d devfest -v src/db_backups/devfest.dump
   ```

3. **Update your `.env` file** with the correct database credentials.

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs`. It provides detailed information about the available endpoints and their usage.

## Running the Application

To start the application, run:
```bash
cd src
nodemon server.js
```
The server will be running on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.