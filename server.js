const express = require('express');
const morgan = require('morgan');
const blogPostRouter = require('./blogPostRouter');
const {PORT, DATABASE_URL} = require('./config')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


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
function runServer(databaseUrl, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {}, err => {
      if (err) {
        return reject(err);
      }
    })
    server = app.listen(port, () => {
      console.log(`App listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      mongoose.disconnect()
      reject(err)
    });  
  });
}
  
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      mongoose.disconnect();
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL, PORT).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};