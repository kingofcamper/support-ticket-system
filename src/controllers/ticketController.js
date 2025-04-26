const { Ticket, User } = require("../models");
const { sendEmail } = require("../utils/email");

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
    // const ticket = await Ticket.findByPk(ticketId, {
    //   include: [{ model: User, as: "creator" }],
    // });
    const ticket = await Ticket.findByPk(ticketId, {
      include: [{ model: User, as: "creator" }],
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    console.log("ticket.userId", ticket);

    // Only the ticket owner OR admin can update
    if (ticket.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    await ticket.save();

    // Send Email Notification
    console.log("ticket.creator", ticket.creator);

    if (ticket.creator && ticket.creator.email) {
      await sendEmail(
        ticket.creator.email,
        "Your Ticket Has Been Updated",
        `Hello ${ticket.creator.name},\n\nYour ticket "${ticket.title}" has been updated.\n\nThank you,\nSupport Team`
      );
    }

    res.json({ message: "Ticket updated and user notified", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Close Ticket (only admin or ticket owner)
exports.closeTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findByPk(ticketId, {
      include: [{ model: User, as: "creator" }], // Include creator for email notification
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only the ticket owner OR admin can close the ticket
    if (ticket.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.status = "closed";
    await ticket.save();

    // Send Email Notification
    if (ticket.creator && ticket.creator.email) {
      await sendEmail(
        ticket.creator.email,
        "Your Ticket Has Been Closed",
        `Hello ${ticket.creator.name},\n\nYour ticket titled "${ticket.title}" has been closed.\n\nThank you for using our service.\nSupport Team`
      );
    }

    res.json({ message: "Ticket closed and user notified", ticket });
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
