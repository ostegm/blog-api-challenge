const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

// Add a few test Posts.
BlogPosts.create('A new hope', 'Some content', 'Luke SkyWalker', '1974');
BlogPosts.create('Return of the Jedi', 'Other content', 'Yoda', '1975');


router.get('/', (req, res) => {
  res.json(BlogPosts.get())
})

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author']
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  item = BlogPosts.create(
    req.body.title, req.body.content, req.body.author, req.body.publishDate)
  res.status(201).json(item)
})

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  console.log(`Deleted  post ${req.params.id}`);
  res.status(204).end();
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    publishDate: req.body.publishDate,
    author: req.body.author
  });
  res.status(204).end();
})

module.exports = router;