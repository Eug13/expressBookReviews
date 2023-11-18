const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const books_with_promise = new Promise((resolve, reject)=> {
    if(books) {
        resolve(books);
    } else {
        reject( new Error('There is no books!'));
    }
});

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username) return res.status(300).json({message: "Username is not provided"});
  if(!password) return res.status(300).json({message: "Password is not provided"});
  const user = users.filter((user) => user.username === username);
  if (user.length > 0)  return res.status(300).json({message: "User already exist"});
  users.push({ username, password });
  return res.status(200).json({ message: "User added" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  books_with_promise
    .then((b) => res.send(JSON.stringify(b, null, 4)))
    .catch((e) => res.status(403).json({message: e.message }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  books_with_promise
    .then((b) => res.send(JSON.stringify(b[isbn], null, 4)))
    .catch((e) => res.status(403).json({message: e.message }));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  books_with_promise
    .then((b) => {
        const bookByAuthor = Object.values(b).filter((book) => book.author === author);
        return res.send(JSON.stringify(bookByAuthor, null, 4));
    })
    .catch((e) => res.status(403).json({message: e.message }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    books_with_promise
    .then((b) => {
        const bookByTitle = Object.values(b).filter((book) => book.title === title);
        return res.send(JSON.stringify(bookByTitle, null, 4));
    })
    .catch((e) => res.status(403).json({message: e.message }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]?.reviews, null, 4))
});

module.exports.general = public_users;
