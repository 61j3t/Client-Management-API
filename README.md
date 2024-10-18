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
   CREATE DATABASE your_database;
   ```

2. **Run the Schema Script**: Execute the SQL schema file to create the necessary tables. You can do this using `psql` or `pgcli`:

   ```bash
   psql -h your_host -U your_user -d your_database -f src/db/schema.sql
   ```

   Alternatively, if you are using `pgcli`, you can run:

   ```sql
   \i src/db/schema.sql
   ```

3. **Import Sample Data (Optional)**: If you have a sample data file, you can import it using the following command:

   ```bash
   psql -h your_host -U your_user -d your_database -c "\copy clients FROM 'path_to_your_sample_data.csv' WITH CSV HEADER;"
   ```

4. **Run the Application**: After setting up the database, you can start the application.

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs`. It provides detailed information about the available endpoints and their usage.

## Running the Application

To start the application, run:
```bash
npm start
```
The server will be running on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.