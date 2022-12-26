const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    for (const user of users) {
        if(user[username]) return false
    }
    return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
    for (const user of users) {
        if(user[username] === password) {
            return true
        }
    }
    return false
}

regd_users.get("/users", (req,res)=> {
    res.send(users)
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body
  if (username && password) {
      if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', {expiresIn: 60 *60})

        req.session.auth = {
            accessToken, username
        }

        return res.status(200).json({"message":"User logged in"})
      }
  }
    res.status(208).json({"message":"Invalid Credentials"})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review
  const isbn = req.params.isbn
  const username = req.session.auth.username
  books[isbn].reviews[username] = review
  return res.status(200).json({"message":"Review added"})
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
    const username = req.session.auth.username
    const isbn = req.params.isbn

    delete books[isbn].reviews[username]
    return res.status(200).json({"message":"Review deleted"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
