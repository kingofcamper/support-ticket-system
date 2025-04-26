const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

router.get("/", authenticate, authorizeAdmin, dashboardController.getDashboardStats);

module.exports = router;
