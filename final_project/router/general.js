const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for registration" });
  }
  if (!isValid(username)){
    return res.status(400).json({message: "This username already exist, try another"});
  }  
  
  let user = users.filter(u => u.username === username);
  user[0]["password"] = password
  user[0]["token"] = ""
  return res.status(200).json({message: "User was registerd successfully"});
});

public_users.get('/', async function (req, res) {
    try {
      return res.send(200, JSON.stringify(books));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book list" });
    }
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try{
        let isbn = req.params.isbn;
        let book = books[isbn]
        return res.send(200, book);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try{
        let autor = req.params.author
        let _books = []
      
        for (const key in books) {
          if (books.hasOwnProperty(key)) {
            const book = books[key];
            if (book.author.includes(autor)) {
              _books.push(book);
            }
          }
        }
        return res.send(200, _books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try{
        let title = req.params.title
        let _books = []
        for (const key in books) {
          if (books.hasOwnProperty(key)) {
            const book = books[key];
            if (book.title.includes(title)) {
              _books.push(book);
            }
          }
        }
        return res.send(200, _books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    } 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let review = books[isbn].reviews
    return res.send(200, review);
});

module.exports.general = public_users;
