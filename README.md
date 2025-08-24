## Packages Used

# Syno WP React Plugin

A custom WordPress plugin built with **React.js** and **Laravel Illuminate components** that integrates modern JavaScript workflows (React, Webpack, Babel) with WordPress.  
It provides a seamless admin interface using React, REST API integration for database operations, and Laravel’s database layer for advanced queries and pagination.  
## Features
- React-based admin interface for managing data.
- REST API integration for CRUD operations on custom post types.
- Laravel Illuminate database layer for database interactions.
- Pagination support for large datasets.
- Customizable admin interface with React components.
## Requirements
- WordPress 6.0 or higher
- PHP 8.2 or higher
- Node.js v22.18.0
- Composer for PHP dependencies
## Dependencies
This plugin relies on several JavaScript and PHP packages to function correctly. Below is a list of the main dependencies used in the project.

### JavaScript Dependencies

- **axios** (^1.7.7): Promise-based HTTP client for making API requests.
- **react** (^18.3.1): Core library for building user interfaces.
- **react-dom** (^18.3.1): DOM-specific methods for React.
- **react-router-dom** (^7.8.2): Declarative routing for React web applications.
- **react-toastify** (^11.0.5): Toast notifications for React apps.

### JavaScript Dev Dependencies

- **@babel/core** (^7.25.2): Babel compiler core for JavaScript transpilation.
- **@babel/plugin-transform-class-properties** (^7.27.1): Babel plugin to support class properties syntax.
- **@babel/preset-env** (^7.25.4): Babel preset for compiling ES6+ down to ES5.
- **@babel/preset-react** (^7.24.7): Babel preset for compiling React JSX.
- **babel-loader** (^9.1.3): Webpack loader for Babel transpilation.
- **cross-env** (^7.0.3): Set environment variables across platforms.
- **css-loader** (^7.1.2): Webpack loader to import CSS files.
- **file-loader** (^6.2.0): Webpack loader for importing files (images, fonts, etc.).
- **style-loader** (^4.0.0): Injects CSS into the DOM via `<style>` tags.
- **webpack** (^5.94.0): Module bundler for JavaScript applications.
- **webpack-cli** (^5.1.4): Command line interface for Webpack.

### PHP Dependencies (via Composer)

- **php** (>=8.0): Minimum required PHP version.
- **illuminate/database** (^12.25.0): Laravel database package for database operations.
- **illuminate/pagination** (^12.25.0): Laravel pagination package for paginating results.
- **illuminate/support** (^12.25.0): Laravel support utilities and helpers.

Refer to `composer.json` for the complete list of PHP packages required by the plugin.

## Installation Instructions
1. Ensure you have Node.js and Composer installed on your system.
2. Clone the repository to your WordPress plugins directory.
3. Navigate to the plugin directory and run `npm install` to install JavaScript dependencies.
4. Run `composer install` to install PHP dependencies.
5. Build the JavaScript assets using `npm run build` or `npm run dev` for development mode.
6. Activate the plugin from the WordPress admin dashboard.
7. Configure the plugin settings as needed.

## Usage
1. Access the plugin features from the WordPress admin menu.
2. Use the provided REST API endpoints for data operations.
3. Customize the plugin as per your requirements.

## Support
For support, please open an issue on the GitHub repository or contact the plugin author directly.

