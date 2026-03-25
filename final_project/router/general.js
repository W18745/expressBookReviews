const express = require('express');
//include axios
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
public_users.get('/', async (req, res) => {
    try {
        // Fetch books from your API
        const response = await axios.get('http://localhost:5000/books');

        // Send the data directly
        return res.json(response.data);

    } catch (e) {
        return res.status(400).json({
            message: "Get books error",
            error: e.message
        });
    }
});

// Get book details based on ISBN //Task 11

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        if (!isbn) {
            return res.status(404).json({ message: "Invalid ISBN" });
        }

        // Fetch all books from API
        const response = await axios.get('http://localhost:5000/');
        const books = response.data;

        if (books[isbn]) {
            return res.json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Invalid ISBN" });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        //Author Data validation
        if (!author) {
            return res.status(404).json({ message: "Error: Invalid Author" });
        }
        else if(author == ""){
            return res.status(404).json({ message: "Error: Blank Authour" });

        // Example: fetch books from an API endpoint
        const response = await axios.get('http://localhost:5000/');

        const books = response.data;

        const bookArray = Object.keys(books).map(key => ({
            [key]: books[key]
        }));

        const filterbooks = bookArray.filter(
            e => Object.values(e)[0].author === author
        );

        return res.json(filterbooks);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
});

public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;

        if (!title) {
            return res.status(404).json({ message: "Error: Title not Found" });
        }

        // Fetch books from API
        const response = await axios.get('http://localhost:5000/');
        const books = response.data;

        const bookArray = Object.keys(books).map(key => ({
            [key]: books[key]
        }));

        const filterbooks = bookArray.filter(
            e => Object.values(e)[0].title === title
        );

        return res.json(filterbooks);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
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
