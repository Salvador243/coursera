const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "root", password: "admin", token : ""}];
//{username: user, password: pass, token : tkn}

const isValid = (username)=>{ 
    users.forEach((index, value) => {
        if(index.username == username)
            return false;
    });
    users.push( {
        username : username
    });

    return true;
}

const authenticatedUser = (username,password)=>{
    let flag = false;
    users.forEach((index, value ) => {
        if(index.username == username && index.password == password){
            const token = jwt.sign({ username }, "wordSecret", { expiresIn: '2h' });
            index.token = token;
            console.log(token)
            flag =  true;
        }
    }); 
    return flag;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    let auth = authenticatedUser(username, password);

    if(auth){
        return res.status(200).json({message: "Autenticated successfully!"});
    }
    return res.status(300).json({message: "Credentials are not valid"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let { review } = req.body;
    let username = req.username;

    books[isbn].reviews[username] = review;
    return res.status(300).json({message: "La reseña se modifico correctamente"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.username;
    if (books[isbn].reviews.hasOwnProperty(username)) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found for the user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
