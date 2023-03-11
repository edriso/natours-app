const express = require('express');
const router = express.Router();

const toursController = require('../controllers/toursController');

router.param('id', toursController.checkID);

router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.checkBody, toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
