// GET /api/admin/ping: proves the auth + role chain end to end. Reached only with an admin token.
const ping = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pong',
    data: { admin: { id: req.user.id, role: req.user.role } },
  });
};

module.exports = { ping };
