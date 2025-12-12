// routes/tourRoutes.js (CẦN SỬA)

const express = require("express");
const {
  createNewTour,
  readAllTours,
  readOneTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");

const router = express.Router();

// Định nghĩa API CRUD
router.post("/create", createNewTour);
router.get("/", readAllTours);
router.get("/:id", readOneTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);

module.exports = router;
