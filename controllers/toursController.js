const fs = require('fs');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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
  const { id } = req.params;
  const tour = tours.find((el) => el.id === Number(id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === Number(id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<UPDATED TOUR>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === Number(id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  tours = tours.filter((el) => el.id !== tour.id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: {
          tour: null,
        },
      });
    }
  );
};

module.exports = { getAllTours, createTour, getTour, updateTour, deleteTour };
