const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const ID = "64bf7c70a666a99217e39bbb";
  const MOCK_DATA = [
    {
      _id: ID,
      user: USER_ID,
      title: "Les Misérables",
      conntent: "Victor Hugo",
      status: "draft",
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "Wario",
    content: "World",
    status: "draft",
  };
  const MOCK_DATA_Updated = {
    title: "Yoshi",
    content: "Island",
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    // mongoose.Query.prototype.save = jest
    //   .fn()
    //   .mockResolvedValue(MOCK_DATA_CREATED);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Articles] Create", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Articles] Modif", async () => {
    const res = await request(app)
      .put(`/api/articles/${ID}`)
      .send(MOCK_DATA_Updated)
      .set("x-access-token", token);
    expect(res.body.title).toBe(MOCK_DATA_Updated.title);
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
