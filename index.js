// implement your API here
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.get('*', handleDefaultRequest);

function handleDefaultRequest(req, res) {
  res.json('hello world');
}

app.listen(port || 3000, () => {
  console.log('listening on ' + (port || 3000));
});
