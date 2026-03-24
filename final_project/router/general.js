const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted friends data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;
    if(isbn && books[isbn]){
        res.send(JSON.stringify(books[isbn],null,4));
    }
    else{
          res.send(`Invalid ISBN`);
    }
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if (author){
        const bookArray = Object.keys(books).map(key => {
              return {[key]:books[key]};
          });
        const filterbooks = bookArray.filter(e=>Object.values(e)[0].author === author);
        res.send(JSON.stringify(filterbooks,null,4));
    }
    else{
        res.send("Authour Key error")
    }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
