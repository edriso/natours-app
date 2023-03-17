const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const asyncWrapper = require('../middleware/asyncWrapper');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

const getAllTours = asyncWrapper(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute Query
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results: tours.length,
      tours,
    },
  });
});

const createTour = asyncWrapper(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({ status: 'success', data: { tour: newTour } });
});

const getTour = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const updateTour = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const deleteTour = asyncWrapper(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = asyncWrapper(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: {
          $toUpper: '$difficulty',
        },
        totalTours: { $sum: 1 },
        totalRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // Sorting the above results based on one of its properties
      $sort: { minPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

const getMonthlyPlan = asyncWrapper(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
    // {
    //   $limit: 3,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      results: plan.length,
      plan,
    },
  });
});

module.exports = {
  aliasTopTours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
