/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.DB, {
  useNewUrlParser: true, useUnifiedTopology: true
});

const bookSchema = new Schema({
  comments: [{ type: String, default: [] }],
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 }
});
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, users) => {
        if (err) return res.send(err);

        res.send(users);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      
      if (typeof title === "undefined" || title === null || title === "") {
        return res.send("missing required field title");
      }

      const book = new Book({ title: title });
      book.save(err => {
        if (err) return res.send(err);

        res.send({ _id: book._id, title: book.title });
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, err => {
        if (err) return res.send(err);

        res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      if (typeof bookid === "undefined" || bookid === null || bookid === "") {
        return res.send("missing required field title");
      }

      Book.findById(bookid, (err, book) => {
        if (err || !book) return res.send("no book exists");

        res.send(book);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if (typeof bookid === "undefined" || bookid === null || bookid === "") {
        return res.send("missing required field title");
      }
      if (typeof comment === "undefined" || comment === null || comment === "") {
        return res.send("missing required field comment");
      }

      Book.findOneAndUpdate(
        { _id: bookid },
        { 
          $push: { comments: comment },
          $inc: { commentcount: 1 }
        },
        { new: true },
        (err, updatedBook) => {
          if (err || !updatedBook) return res.send("no book exists");

          res.send(updatedBook);
        }
      );
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      if (typeof bookid === "undefined" || bookid === null || bookid === "") {
        return res.send("missing required field title");
      }

      Book.findByIdAndDelete(bookid, (err, deletedBook) => {
        if (err || !deletedBook) return res.send("no book exists");

        res.send("delete successful");
      });
    });
  
};
