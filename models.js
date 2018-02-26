'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const blogPostsSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  publishDate: {type: Date, default: Date.now}
});

blogPostsSchema.virtual('authorFullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
})

blogPostsSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorFullName,
    publishDate: this.publishDate
  }
}



const BlogPosts = mongoose.model('blogposts', blogPostsSchema);

module.exports = {BlogPosts};