const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name should be less or equal to 40 characters'],
      maxlength: [8, 'A tour name should be more or equal to 8 characters'],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
      required: [true, 'A tour must have a difficulty'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a desription'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now, //Date.now instead of Date.now(); this let's atlas make the time when going to server so it will be at least 1 millisecond difference "unique value"
    //   select: false,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    id: false,
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  if (this.duration) return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() "not insertMany nor findAndUpdate..."
tourSchema.pre('save', function (next) {
  // this refers to the current document
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.post('save', function (doc, next) {
//   // we don't have access to 'this', instead we have 'doc'
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // this refers to the current query
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});
// tourSchema.post('find', function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // this refers to the current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
