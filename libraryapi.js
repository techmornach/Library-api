// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

// Create a book model
const Book = mongoose.model("Book", bookSchema);

// API endpoints
app.get("/api/books", (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(books);
  });
});

app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  });
});

app.post("/api/books", (req, res) => {
  const { title, author } = req.body;
  const book = new Book({ title, author });
  book.save((err, savedBook) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json(savedBook);
  });
});

app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  Book.findByIdAndUpdate(
    bookId,
    { title, author },
    { new: true },
    (err, updatedBook) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!updatedBook) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(updatedBook);
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  Book.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(deletedBook);
  });
});

// Search books by title or author
app.get("/api/search", (req, res) => {
  const { query } = req.query;
  const searchRegex = new RegExp(query, "i");
  Book.find(
    { $or: [{ title: searchRegex }, { author: searchRegex }] },
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});

// Pagination support
app.get("/api/books/page/:page", (req, res) => {
  const pageSize = 5;
  const currentPage = parseInt(req.params.page);
  const skipCount = (currentPage - 1) * pageSize;
  Book.find({})
    .skip(skipCount)
    .limit(pageSize)
    .exec((err, paginatedBooks) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(paginatedBooks);
    });
});

// Sorting books
app.get("/api/books/sort/:field", (req, res) => {
  const field = req.params.field.toLowerCase();

  const sortOptions = {
    title: { title: 1 },
    author: { author: 1 },
  };

  if (!sortOptions[field]) {
    return res.status(400).json({ error: "Invalid sorting field" });
  }

  Book.find({})
    .sort(sortOptions[field])
    .exec((err, sortedBooks) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(sortedBooks);
    });
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

// Apply authentication middleware to specific routes
app.get("/api/books/secure", authenticate, (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(books);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
