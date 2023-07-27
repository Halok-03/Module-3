const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");
const authMiddleware = require("../middlewares/auth");

jest.mock("../middlewares/auth");

describe("tester API articles", () => {
  let token;
  const ID = "64bf7c70a666a99217e39bbb";
  const MOCK_DATA = [
    {
      _id: ID,
      user: "fake",
      title: "Les Misérables",
      content: "Victor Hugo",
      status: "draft",
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "Wario",
    content: "World",
    status: "draft",
  };
  const MOCK_DATA_UPDATED = {
    title: "Yoshi",
    content: "Island",
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: "fake" }, config.secretJwtToken);

    authMiddleware.mockImplementation((req, res, next) => {
      req.user = { userId: "fake", role: "admin" };
      next();
    });

    jest.spyOn(articlesService, "create").mockImplementation(async (data) => {
      const createdArticle = {
        ...data,
        _id: ID,
        user: "fake",
      };
      MOCK_DATA.push(createdArticle);
      return createdArticle;
    });

    jest.spyOn(articlesService, "update").mockResolvedValue(MOCK_DATA_UPDATED);
    jest.spyOn(articlesService, "delete").mockResolvedValue(true);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
  });

  test("[Articles] Create", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Modif", async () => {
    const res = await request(app)
      .put(`/api/articles/${ID}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
  });

  test("[Articles] Delete", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
