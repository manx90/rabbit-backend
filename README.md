# Rabbit Backend Service

<p align="center">
  <img src="./assets/images/logo/logo-white.png" alt="Rabbit Logo" width="200" />
</p>

## Overview

The Rabbit Backend is a NestJS-based API service that powers the Rabbit e-commerce platform. It provides authentication, product management, order processing, and other core functionalities required by the Rabbit ecosystem.

## Project Structure

The project is organized into several key modules:

- **Auth**: Handles user authentication, registration, and authorization
- **Product**: Manages product catalog, categories, and inventory
- **Order**: Processes customer orders and manages order lifecycle
- **Config**: Contains application configuration settings

## Technical Details

- **Framework**: NestJS v11
- **Database**: MySQL with TypeORM
- **Authentication**: JWT-based with Passport
- **API Documentation**: Swagger/OpenAPI

## Entity Relationships

- The Auth entity uses string UUIDs for IDs (`@PrimaryGeneratedColumn('uuid')`) while much of the application code handles IDs as numbers, requiring `.toString()` conversion.
- The Auth and Order entities have a bidirectional relationship:
  - The Order entity has a `readyBy` field that references Auth
  - The Auth entity has an `orders` field that references Order using string reference pattern: `@OneToMany('Order', 'readyBy')`

## Update

- Switched the database from PostgreSQL to MySQL.
- Updated the login system to include product verification.
- Database connection settings are now in the `.env` file with MySQL-specific variables.

## Configuration

Create a `.env` file in the root directory and add the following variables:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=test
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_EXPIRATION=15m
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

### Installation

```bash
# Install dependencies
$ npm install

# Configure environment variables
# Copy .env.example to .env and update values
$ cp .env.example .env
```

### Running the Application

```bash
# Development with auto-reload (using SWC for faster builds)
$ npm run sd

# Build the application
$ npm run build

# Production mode
$ npm run start:prod
```

### Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

## Notes

- The login system verifies products during authentication.
- Configuration is centralized in `.env` for easy management of secrets and database connection.

## Related Projects

- **Rabbit Admin**: Admin dashboard for managing products, orders, and users
- **Rabbit Products**: Frontend product catalog and shopping experience

## License

This project is proprietary and confidential. Unauthorized copying, transfer, or reproduction of the contents of this repository is strictly prohibited.
