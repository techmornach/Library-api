# LIBRARY API

This document provides detailed information about the API endpoints, configuration, and usage of the Book API.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [Get All Books](#get-all-books)
  - [Get a Book](#get-a-book)
  - [Create a Book](#create-a-book)
  - [Update a Book](#update-a-book)
  - [Delete a Book](#delete-a-book)
  - [Search Books](#search-books)
  - [Paginate Books](#paginate-books)
  - [Sort Books](#sort-books)
  - [Secure Endpoint](#secure-endpoint)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Book API provides a set of endpoints to manage books. It allows users to perform operations such as retrieving all books, getting information about a specific book, creating new books, updating existing books, deleting books, searching for books by title or author, paginating through a list of books, and sorting books based on specific fields.

## Getting Started

### Installation

To install and run the Book API, follow these steps:

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the dependencies by running the following command:
   ```shell
   npm install
   ```
4. Start the server:
   ```shell
   npm start
   ```
   The API will be available at `http://localhost:3000` by default.

### Configuration

The API requires some configuration settings. Before starting the server, make sure to set up the following environment variables:

- `MONGODB_URI`: The connection URI for the MongoDB database.
- `API_KEY`: The API key required for accessing the secure endpoint.
- `PORT` (optional): The port number on which the server will run. If not provided, it will default to `3000`.

Create a file named `.env` in the root directory of the project and add the environment variables in the following format:

```shell
MONGODB_URI=<your-mongodb-uri>
API_KEY=<your-api-key>
PORT=<optional-port-number>
```

## API Endpoints

### Get All Books

- **Endpoint:** `/api/books`
- **Method:** GET
- **Description:** Retrieves a list of all books.
- **Response:** Returns an array of book objects in the following format:
  ```json
  [
    {
      "_id": "book-id",
      "title": "Book Title",
      "author": "Book Author"
    }
    // ...
  ]
  ```

### Get a Book

- **Endpoint:** `/api/books/:id`
- **Method:** GET
- **Description:** Retrieves information about a specific book.
- **Parameters:**
  - `id` (required): The ID of the book.
- **Response:**
  - If the book is found, it returns a book object in the following format:
    ```json
    {
      "_id": "book-id",
      "title": "Book Title",
      "author": "Book Author"
    }
    ```
  - If the book is not found, it returns an error response with status code 404 and an error message.

### Create a Book

- **Endpoint:** `/api/books`
- **Method:** POST
- **Description:** Creates a new book.
- **Request Body:**
  - `title` (required): The title of the book
  - `author` (required): The author of the book.
- **Response:**
  - If the book is created successfully, it returns the created book object with status code 201 in the following format:
    ```json
    {
      "_id": "book-id",
      "title": "Book Title",
      "author": "Book Author"
    }
    ```
  - If there is an error during the creation process, it returns an error response with status code 500 and an error message.

### Update a Book

- **Endpoint:** `/api/books/:id`
- **Method:** PUT
- **Description:** Updates an existing book.
- **Parameters:**
  - `id` (required): The ID of the book.
- **Request Body:**
  - `title` (optional): The updated title of the book.
  - `author` (optional): The updated author of the book.
- **Response:**
  - If the book is found and updated successfully, it returns the updated book object with status code 200 in the following format:
    ```json
    {
      "_id": "book-id",
      "title": "Updated Book Title",
      "author": "Updated Book Author"
    }
    ```
  - If the book is not found, it returns an error response with status code 404 and an error message.
  - If there is an error during the update process, it returns an error response with status code 500 and an error message.

### Delete a Book

- **Endpoint:** `/api/books/:id`
- **Method:** DELETE
- **Description:** Deletes an existing book.
- **Parameters:**
  - `id` (required): The ID of the book.
- **Response:**
  - If the book is found and deleted successfully, it returns the deleted book object with status code 200 in the following format:
    ```json
    {
      "_id": "book-id",
      "title": "Deleted Book Title",
      "author": "Deleted Book Author"
    }
    ```
  - If the book is not found, it returns an error response with status code 404 and an error message.
  - If there is an error during the deletion process, it returns an error response with status code 500 and an error message.

### Search Books

- **Endpoint:** `/api/search`
- **Method:** GET
- **Description:** Searches for books by title or author.
- **Query Parameters:**
  - `query` (required): The search query string.
- **Response:**
  - If books matching the search query are found, it returns an array of book objects in the following format:
    ```json
    [
      {
        "_id": "book-id",
        "title": "Book Title",
        "author": "Book Author"
      }
      // ...
    ]
    ```
  - If no books are found, it returns an empty array.
  - If there is an error during the search process, it returns an error response with status code 500 and an error message.

### Paginate Books

- **Endpoint:** `/api/books/page/:page`
- **Method:** GET
- **Description:** Retrieves a paginated list of books.
- **Parameters:**
  - `page` (required): The page number to retrieve.
- **Response:**
  - If books are found for the specified page, it returns an array of book objects in the following format:
    ```json
    [
      {
        "_id": "book-id",
        "title": "Book Title",
        "author": "Book Author"
      }
      // ...
    ]
    ```
  - If no books are foundfor the specified page, it returns an empty array.
  - If there is an error during the pagination process, it returns an error response with status code 500 and an error message.

### Sort Books

- **Endpoint:** `/api/books/sort/:field`
- **Method:** GET
- **Description:** Retrieves a sorted list of books based on a specified field.
- **Parameters:**
  - `field` (required): The field to sort the books by. Currently supported fields are `title` and `author`.
- **Response:**
  - If the specified field is valid, it returns an array of book objects sorted based on the field in ascending order.
  - If the specified field is invalid, it returns an error response with status code 400 and an error message.
  - If there is an error during the sorting process, it returns an error response with status code 500 and an error message.

### Secure Endpoint

- **Endpoint:** `/api/books/secure`
- **Method:** GET
- **Description:** Retrieves a list of books from a secure endpoint that requires authentication.
- **Request Header:**
  - `x-api-key` (required): The API key for authentication.
- **Response:**
  - If the API key is valid, it returns an array of book objects.
  - If the API key is missing or invalid, it returns an error response with status code 401 and an error message.
  - If there is an error during the retrieval process, it returns an error response with status code 500 and an error message.

## Error Handling

The API handles errors in the following ways:

- If an endpoint encounters an error, it returns an error response with status code 500 and an error message.
- For specific error scenarios such as book not found or invalid sorting field, it returns error responses with appropriate status codes and error messages.
- The global error handling middleware is in place to catch and handle any unhandled errors, providing a consistent error response with status code 500 and an error message.

## Contributing

Contributions to the Book API are welcome! If you find any issues or want to add new features, feel free to submit a pull request or open an issue in the repository.

## License

The Book API is released under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute the code as per the terms of the license.
