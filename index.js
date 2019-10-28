// implement your API here
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const db = require('./data/db');

const app = express();

app.use(cors());
app.use(express.json());

app.put('/api/users/:id', handleUpdateUser);
app.delete('/api/users/:id', handleDeleteUser);
app.get('/api/users/:id', handleGetSingleUser);
app.get('/api/users', handleGetAllUsers);
app.post('/api/users', handleAddUser);

function handleUpdateUser(req, res) {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(changes);
      } else if (!changes.name || !changes.body) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user' });
      } else {
        res.status(404).json({
          errorMessage: 'The user with the specifed id does not exist'
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be modified' });
    });
}

function handleDeleteUser(req, res) {
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          errorMessage: 'The user with the specified id does not exist'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
}

function handleGetSingleUser(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({
          errorMessage: 'The user with the specified id does not exist'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: 'The user information cannot be retrieved'
      });
    });
}

function handleGetAllUsers(req, res) {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: 'The users information could not be retirieved'
      });
    });
}

function handleAddUser(req, res) {
  const userInfo = req.body;
  if (!userInfo.name || !userInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  }

  db.insert(userInfo)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({
        error: 'There was an error while saving the user to the database'
      });
    });
}

app.listen(port || 3000, () => {
  console.log('listening on ' + (port || 3000));
});
