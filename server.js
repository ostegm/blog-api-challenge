const express = require('express');
const morgan = require('morgan');
const PORT = (process.env.PORT || 8080)

app = express();


app.get('/', (req, res) => res.send('nothing to see here.'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});