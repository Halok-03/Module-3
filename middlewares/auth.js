const User = require("../api/users/users.model");
const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }

    const decoded = jwt.verify(token, config.secretJwtToken);
    const userId = decoded.userId;

    // Récupérer toutes les informations de l'utilisateur à partir de l'ID de l'utilisateur
    const user = await User.findById(userId);

    if (!user) {
      throw new UnauthorizedError("Utilisateur introuvable");
    }

    // Ajouter toutes les informations de l'utilisateur à req.user
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Ajoutez d'autres propriétés utilisateur si nécessaire
    };

    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
