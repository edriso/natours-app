class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // Advanced filtering (gt, lte)
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // \b for exact word

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // this referfs to the entire object; to be able to chain methods later
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      /*
      ('-createdAt _id') instead of ('-createdAt') to fix the bug of repeated tours when using pagination
      https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065096#questions/14026396
      - According to documentation at Mongo
      when using $skip with $sort it is advised to include _id or another unique identifier
      as any duplicates can cause errors (as we have seen).
      */
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    // limit=3&page=2, 1-3 page1, 4-6 page2, 7-9 page3
    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;
