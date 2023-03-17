const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    // fn(req, res, next).catch((err) => next(err));
    // fn(req, res, next).catch(next); // same as above
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncWrapper;
