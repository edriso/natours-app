const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name should be less or equal to 40 characters'],
      minlength: [8, 'A tour name should be more or equal to 8 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'en-US', { ignore: ' ' });
        },
        message: 'Name should only contain characters',
      },
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
      min: [1, 'Rating must be above or equals to 1.0'],
      max: [5, 'Rating must below or equals to 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    startDates: [Date],
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only refers to current document on creating a new doc
          // to handle on update (note: price should also be sent):
          if (this.op.match(/^find/)) {
            return val < this.getUpdate().$set.price;
          }
          return val < this.price; // error if val is greater
        },
        message: 'Discount price ({VALUE}) should below regular price',
      },
    },
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
