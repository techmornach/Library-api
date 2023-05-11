// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const os = require("os");

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/books", async (req, res) => {
  const { title, author } = req.body;
  const book = new Book({ title, author });
  try {
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search books by title or author
app.get("/api/books/search", async (req, res) => {
  const { query } = req.query;
  const searchRegex = new RegExp(query, "i");
  try {
    const results = await Book.find({
      $or: [{ title: searchRegex }, { author: searchRegex }],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Pagination support
app.get("/api/books/page/:page", async (req, res) => {
  const pageSize = 5;
  const currentPage = parseInt(req.params.page);
  const skipCount = (currentPage - 1) * pageSize;
  try {
    const books = await Book.find({}).skip(skipCount).limit(pageSize);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ipAddresses = Object.values(networkInterfaces)
    .flatMap((interfaces) => interfaces.filter((iface) => iface.family === "IPv4" && !iface.internal))
    .map((iface) => iface.address);

  console.log("Server started on the following IP addresses:");
  ipAddresses.forEach((ip) => console.log(ip));

  console.log(`Server started on port ${port}`);
});