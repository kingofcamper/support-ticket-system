const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

// All routes protected
router.post("/", authenticate, ticketController.createTicket);
router.put("/:ticketId", authenticate, ticketController.updateTicket);
router.put("/:ticketId/close", authenticate, ticketController.closeTicket);
router.get("/my-tickets", authenticate, ticketController.getMyTickets);
router.put("/:ticketId/assign-agent", authenticate, authorizeAdmin, ticketController.assignAgent);

module.exports = router;
