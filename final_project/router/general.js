const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const {username,password} = req.body
  if (username && password) {
      if (isValid(username)) {
          users.push({[username]:password})
          res.status(200).json({"message":`User ${username} has been registered`})
      }
      else {
          res.status(403).json({"message":`Username: ${username} already exists!`})
      }
  }
  else {
      res.status(403).json({"message":"Please provide both username and password"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if (books[isbn]) {
      res.send(books[isbn])
  }
  else {
      res.status(404).json({"message":"Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let book = []
  for (const key in books) {
    if (books[key].author === author) {
        book.push(books[key])
    }
  }
  res.send(book)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let book = []
    for (const key in books) {
      if (books[key].title === title) {
          book.push(books[key])
      }
    }
    res.send(book)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    res.send(books[isbn].reviews)
});

async function getAllBooks() {
  try {
    const response = await axios.get('/');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function getBookbyISBN(isbn) {
    try {
      const response = await axios.get(`/isbn/${isbn}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

async function getBookbyAuthor(author) {
    try {
      const response = await axios.get(`/author/${author}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function getBookbyTitle(title) {
    try {
      const response = await axios.get(`/title/${title}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

module.exports.general = public_users;
