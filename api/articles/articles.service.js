const Article = require("./articles.schema");

class ArticleService {
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  async getUserArticles(userId) {
    try {
      const articles = await Article.find({ user: userId }, "-user.password")
        .populate("user", "-password")
        .exec();

      return articles;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ArticleService();
