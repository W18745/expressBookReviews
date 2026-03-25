const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`${username}-${password}`)
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop //Task 10
public_users.get('/', async function (req, res) {
  // Send JSON response with formatted friends data
    try{
        await axios.json("");
        res.send(JSON.stringify(books,null,4));
    }
    catch(e){
        res.status(400).json({"message":"Get books error"})
    }
    
});

// Get book details based on ISBN //Task 11
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;
    return new Promise((resolve, reject) => {
        if(isbn && books[isbn]){
            resolve(res.send(JSON.stringify(books[isbn],null,4)));
        }
        else{
            resolve(res.send(`Invalid ISBN`));
        } 
        })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    return new Promise((resolve, reject) => {
        if (author){
            const bookArray = Object.keys(books).map(key => {
                  return {[key]:books[key]};
              });
            const filterbooks = bookArray.filter(e=>Object.values(e)[0].author === author);
            resolve(res.send(JSON.stringify(filterbooks,null,4)));
        }
        else{
            resolve(res.status(404).json({message: "Invalid Author"});
        }
        })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    return new Promise((resolve, reject) => {
        if (title){
            const bookArray = Object.keys(books).map(key => {
                  return {[key]:books[key]};
              });
            const filterbooks = bookArray.filter(e=>Object.values(e)[0].title === title);
            resolve(res.send(JSON.stringify(filterbooks,null,4)));
        }
        else{
            resolve(res.status(404).json({message: "Error: Title not Found"});
        }
        })
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn){
        const book = books[isbn];
        const reviews = book.reviews;
        res.send(JSON.stringify(reviews));
    }
    else{
        res.status(404).json({message: "Error: ISBN not found"}
    }
});

module.exports.general = public_users;
