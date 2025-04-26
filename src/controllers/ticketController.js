const Ticket = require("../models/Ticket");
const User = require("../models/User");

// Create Ticket
exports.createTicket = async (req, res) => {
  const { title, description } = req.body;
  try {
    const ticket = await Ticket.create({
      title,
      description,
      userId: req.user.id, // userId from token
      status: "open",
    });

    res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Ticket (by owner or admin)
exports.updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { title, description } = req.body;

  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only the ticket owner or admin can update
    if (ticket.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    await ticket.save();

    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Close Ticket (only admin or ticket owner)
exports.closeTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.status = "closed";
    await ticket.save();

    res.json({ message: "Ticket closed", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// List all my tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ where: { userId: req.user.id } });
    res.json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
