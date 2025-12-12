// routes/hotelRoutes.js

const express = require("express");
const {
  createNewHotel,
  readAllHotels,
  readOneHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

const router = express.Router();

// CRUD Endpoints cho Admin
router.post("/create", createNewHotel);
router.get("/", readAllHotels);
router.get("/:id", readOneHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

module.exports = router;
