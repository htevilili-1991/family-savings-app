# Family Savings App

This document provides a comprehensive technical overview and setup guide for the Family Savings App, a modern web application built with Laravel, React, and Inertia.js.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Development](#development)
- [Testing](#testing)
- [Code Style](#code-style)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Project Overview
The Family Savings App is designed to help families manage their savings and loans effectively. It provides a user-friendly interface built with React and Inertia.js, backed by a robust Laravel API.

## Technologies Used

### Backend
-   **PHP**: 8.4.11
-   **Laravel Framework**: 12.46.0
-   **Database Engine**: PostgreSQL
-   **Laravel Fortify**: 1.33.0 (Authentication scaffolding)
-   **Inertia.js Laravel Adapter**: 2.0.18 (Connecting Laravel with React)
-   **Laravel Prompts**: 0.3.8 (CLI interactions)
-   **Laravel Wayfinder**: 0.1.13 (Route generation for frontend)
-   **TightenCo Ziggy**: 2.6.0 (Blade-to-JavaScript route helper)
-   **Laravel Pint**: 1.27.0 (PHP code style fixer)
-   **Laravel Sail**: 1.52.0 (Docker development environment)
-   **Pest PHP**: 4.3.1 (Testing Framework)
-   **PHPUnit**: 12.5.4 (PHP Testing Framework)

### Frontend
-   **React**: 19.2.3
-   **Inertia.js React Adapter**: 2.3.7
-   **Tailwind CSS**: 4.1.18
-   **Vite**: (Implicitly used via Laravel Vite Plugin)
-   **ESLint**: 9.39.2 (JavaScript linter)
-   **Prettier**: 3.7.4 (Code formatter)
-   **@laravel/vite-plugin-wayfinder**: 0.1.7 (Vite plugin for Wayfinder)

## Features
-   User Authentication (Registration, Login, Password Reset, Two-Factor Authentication via Laravel Fortify)
-   Dark/Light Mode Toggle
-   Savings Management
-   Loans Management
-   User Roles and Permissions

## Prerequisites
Before you begin, ensure you have met the following requirements:
-   PHP 8.4 or higher
-   Composer
-   Node.js (LTS version recommended)
-   npm or Yarn
-   Docker and Docker Compose (if using Laravel Sail)
-   Git

## Installation Guide

### 1. Clone the repository
```bash
git clone <repository-url>
cd family-savings-app
```

### 2. Environment Setup
Copy the example environment file and generate an application key:
```bash
cp .env.example .env
php artisan key:generate
```
Edit the `.env` file to configure your database connection and other environment variables. For PostgreSQL, ensure `DB_CONNECTION=pgsql` and provide your database credentials.

### 3. Install PHP Dependencies
```bash
composer install
```

### 4. Install JavaScript Dependencies
```bash
npm install # or yarn install
```

### 5. Database Migration and Seeding
Run the database migrations to create the table structure and seed the database with initial data (e.g., roles and permissions, default users):
```bash
php artisan migrate --seed
```

### 6. Starting the Development Server
If you are using Laravel Sail (recommended for Docker users):
```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed # if you haven't already
./vendor/bin/sail npm run dev
```
For local development without Sail:
```bash
php artisan serve
npm run dev
```
Your application will typically be available at `http://127.0.0.1:8000`.

## Development

### Frontend Development
To compile and hot-reload frontend assets:
```bash
npm run dev
```
To build frontend assets for production:
```bash
npm run build
```

### Backend Development
The Laravel framework handles backend logic. Standard Laravel development practices apply.

## Testing

### PHP Tests (Pest & PHPUnit)
To run all PHP unit and feature tests:
```bash
php artisan test
```
To run tests with a compact output:
```bash
php artisan test --compact
```
To run a specific test file:
```bash
php artisan test --compact tests/Feature/YourTest.php
```

### JavaScript Tests
There are no dedicated JavaScript unit tests configured beyond linting and type checking. Frontend functionality is primarily validated through browser-based and feature tests, which can be extended using Pest's browser testing capabilities.

## Code Style

### PHP Code Style (Laravel Pint)
To automatically fix PHP code style issues:
```bash
vendor/bin/pint
```
To check for PHP code style issues without fixing them:
```bash
vendor/bin/pint --test
```

### JavaScript/TypeScript Code Style (ESLint & Prettier)
To automatically fix JavaScript/TypeScript code style issues:
```bash
npm run lint
```
To format JavaScript/TypeScript files:
```bash
npm run format
```

## Folder Structure
-   `app/`: Contains core application logic, including Models, HTTP Controllers, Middleware, Actions, and Policies.
-   `bootstrap/`: Contains framework bootstrap files.
-   `config/`: Application configuration files.
-   `database/`: Database migrations, seeders, and factories.
-   `public/`: The web server's document root.
-   `resources/js/`: Frontend React components, pages, hooks, and layouts.
-   `resources/css/`: Tailwind CSS stylesheets.
-   `routes/`: Web, API, and console routes.
-   `tests/`: Unit and Feature tests.
-   `vendor/`: Composer dependencies.
-   `node_modules/`: npm dependencies.

## Contributing
(Optional: Basic guidelines for contribution)
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Ensure your code adheres to the project's code style (run `vendor/bin/pint` and `npm run lint`).
5. Write and run tests to ensure all functionality works as expected (`php artisan test`).
6. Commit your changes (`git commit -m 'feat: Add new feature'`).
7. Push to the branch (`git push origin feature/your-feature-name`).
8. Open a Pull Request.