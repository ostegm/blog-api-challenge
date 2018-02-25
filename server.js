const express = require('express');
const morgan = require('morgan');
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

//common server object for run/close server ops.
let server;
function runServer() {
  const PORT = (process.env.PORT || 8080)
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });  
  });
}
  
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};