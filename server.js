const express = require('express');
const morgan = require('morgan');
const PORT = (process.env.PORT || 8080)
const blogPostRouter = require('./blogPostRouter');

function logErrors(err, req, res, next) {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'})
}


app = express();

app.use(morgan('common'));
app.get('/', (req, res) => res.send('nothing to see here.'));
app.use('/blog-posts', blogPostRouter);
app.use(logErrors);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});