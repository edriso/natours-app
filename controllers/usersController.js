const fs = require('fs');

let users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
};

const createUser = (req, res) => {
  const id = new Date().valueOf();
  const newUser = { id, ...req.body };

  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({ status: 'success', data: { newUser } });
    }
  );
};

const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<GET USER>',
    },
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<UPDATED USER>',
    },
  });
};

const deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
