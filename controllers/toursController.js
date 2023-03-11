const fs = require('fs');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkID = (req, res, next, val) => {
  const tour = tours.find((el) => el.id === Number(val));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

const checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price!',
    });
  }

  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      results: tours.length,
      tours,
    },
  });
};

const createTour = (req, res) => {
  const id = new Date().valueOf();
  const newTour = { id, ...req.body };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { newTour } });
    }
  );
};

const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<GET TOUR>',
    },
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<UPDATED TOUR>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
};
