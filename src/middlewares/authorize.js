const jwt = require("express-jwt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),

    // authorize based on user role
    async (req, res, next) => {
      const user = await User.findById(req.user.id).populate(
        "role",
        "roleName, -_id"
      );

      if (
        !user ||
        (roles.length &&
          roles.filter(
            (role) => role === req.user.roles.map((ur) => ur.roleName)
          ).length > 0)
      ) {
        // user no longer exists or role not authorized
        return res.status(403).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      req.user.roles = user.roles;
      const refreshTokens = await RefreshToken.find({ user: user.id });
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}

module.exports = authorize;
