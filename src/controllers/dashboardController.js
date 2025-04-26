const { Op } = require("sequelize");
const { Ticket, User } = require("../models"); // assuming you have these models

exports.getDashboardStats = async (req, res) => {
  try {
    // Total number of tickets
    const totalTickets = await Ticket.count();

    // Tickets by status
    const openTickets = await Ticket.count({ where: { status: "open" } });
    const closedTickets = await Ticket.count({ where: { status: "closed" } });

    // Number of agents
    const totalAgents = await User.count({ where: { role: "agent" } });

    // Tickets assigned vs unassigned
    const assignedTickets = await Ticket.count({ where: { agentId: { [Op.not]: null } } });
    const unassignedTickets = await Ticket.count({ where: { agentId: null } });

    res.json({
      totalTickets,
      openTickets,
      closedTickets,
      totalAgents,
      assignedTickets,
      unassignedTickets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
