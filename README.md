# Driver Salary API

This project is a backend API built using Node.js, Express, TypeScript, and PostgreSQL. It provides an API to fetch driver salary data based on attendance and shipment costs for a specific month and year.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v14.x or above)
- PostgreSQL (v12.x or above)
- npm or yarn

### Environment Variables

Create a .env file in the root directory of the project with the following configuration:

### Database Configuration

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### Server Configuration

PORT=3000

Make sure the PostgreSQL database and credentials match what you have set up.

Project Structure

```bash
src/
│
├── controllers/ # Contains route handler logic
│ └── driverController.ts
│
├── services/ # Contains business logic (e.g., SQL query execution)
│ └── driverService.ts
│
├── routes/ # Defines routes and endpoints
│ └── index.ts
│
├── utils/ # Error handling and helper utilities
│ ├── errorHandler.ts
│ └── customErrors.ts
│
├── server.ts # Main entry point of the server
└── config/ # Database connection configuration
  └── database.ts
```

### How to Run the Project

1. Clone the Repository (if needed)
   bash
   Copy code
   git clone https://github.com/your-repo/driver-salary-api.git
   cd driver-salary-api
2. Install Dependencies
   Use npm or yarn to install the required packages.

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

3. Set Up the Database
   Create a PostgreSQL database with the name specified in the .env file.
   Run the following SQL schema to set up the required tables (example below).

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

#### The server will start on http://localhost:3000.

### API Documentation

Endpoint: /v1/salary/driver/list?month={month}&year={year}&current={current}&page_size={page_size}&driver_code={driver_code}&status={status}&name={name}

Method: GET
Query Parameters:

```json
Key | Type | Description

month | Number | The month to filter salary data (e.g., 3)
year | Number | The year to filter salary data (e.g., 2024)
page_size | Number | Number of records per page (default: 10)
current | Number | Current page number (default: 1)
driver_code | String | Filter by driver code (optional)
status | String | Filter by status (PENDING, CONFIRMED, PAID)
name | String | Search driver by name (optional)
```

### Response:

```json
"data": [
{
"driver_code": "DRIVER001",
"name": "Agus",
"total_pending": 5000000,
"total_confirmed": 100000,
"total_paid": 200000,
"total_attendance_salary": 1500000,
"total_salary": 6800000,
"count_shipment": 15
}
],
"total_row": 35,
"current": 1,
"page_size": 10
```

### Error Handling
All errors are handled gracefully, and the server will return proper HTTP status codes with meaningful messages.
``` 
Example:
400 Bad Request: Missing or invalid query parameters.
404 Not Found: Resource not found.
500 Internal Server Error: Unexpected server error.
```