# DevFest Backend

This project sets up an Express server that serves a file for download while logging bandwidth usage for multiple clients. It includes a script to simulate multiple clients downloading the file concurrently.

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- PostgreSQL (for database operations)

## Setup Instructions

1. **Clone the Repository** (if applicable):

   ```bash
   git clone https://github.com/arhvnn/DevFest-Backend.git
   cd DevFest-Backend
   ```
2. **Install Dependencies**:
   Navigate to the project directory and run:

   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the root of your project and add the following variables:

   ```plaintext
   PORT=3000
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=your_database_port
   ```
4. **Start the PostgreSQL Database**:
   Ensure your PostgreSQL database is running and accessible.
5. **Run the Server**:
   You can use Nodemon for automatic restarts on file changes:

   ```bash
   npx nodemon server.js
   ```

   Alternatively, you can run:

   ```bash
   node server.js
   ```
6. **Simulate Clients**:
   To simulate multiple clients downloading the file, you can use the provided shell script. First, ensure the script is executable:

   ```bash
   chmod +x test/simulate_clients.sh
   ```

   Then, run the script:

   ```bash
   ./test/simulate_clients.sh
   ```

## Observing Bandwidth Usage

As clients download the file, you will see logs in the terminal where the server is running, showing the bandwidth usage for each client in kilobits per second (kbps).

## Notes

- Ensure that the file you want to download (e.g., `file.zip`) is present in the same directory as `server.js`.
- Adjust the `BANDWIDTH_LIMIT` in `server.js` if you want to change the download speed cap.
- You can modify the `NUM_CLIENTS` variable in `simulate_clients.sh` to simulate more or fewer clients.

## Troubleshooting

- If you encounter issues with database connections, double-check your `.env` file for correct credentials.
- Ensure that the server is running before executing the client simulation script.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
