const articlesService = require("./articles.service");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
  async create(req, res, next) {
    try {
      const { title, content, status } = req.body;
      const userId = req.user.userId;

      const article = await articlesService.create({
        title,
        content,
        status,
        user: userId,
      });
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      if (req.user.role !== "admin") {
        throw new UnauthorizedError(
          "Uniquement les admins peuvent mofidié les articles."
        );
      }

      const articleModified = await articlesService.update(id, data);
      req.io.emit("article:update", articleModified);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError(
          "Uniquement les admins peuvent mofidié les articles."
        );
      }

      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send("Article Supprimé");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
