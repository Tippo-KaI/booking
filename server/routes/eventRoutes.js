// routes/eventRoutes.js

const express = require("express");
const {
  createNewEvent,
  readAllEvents,
  readOneEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// CRUD Endpoints cho Admin
router.post("/create", createNewEvent);
router.get("/", readAllEvents);
router.get("/:id", readOneEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
