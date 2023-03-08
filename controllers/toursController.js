const fs = require('fs');

const tours = JSON.parse(
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
      console.log(err);
    }
  );

  res.status(201).json({ status: 'success', data: { newTour } });
};

module.exports = { getAllTours, createTour };
