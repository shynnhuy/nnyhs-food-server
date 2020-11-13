const _ = require("lodash");
module.exports = (roles) => (req, res, next) => {
  if (_.isEqual(_.intersection(req.user.roles, roles), roles)) {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
