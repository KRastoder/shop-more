import request from "supertest";
import app from "../../app";

describe("User API", () => {
  it("should create a user", async () => {
    const res = await request(app).post("/user/create").send({
      role: "user",
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.msg).toBeDefined();
  });

  it("should not allow duplicate email", async () => {
    await request(app).post("/user/create").send({
      role: "user",
      name: "Test",
      email: "dup@example.com",
      password: "123456",
    });

    const res = await request(app).post("/user/create").send({
      role: "user",
      name: "Test",
      email: "dup@example.com",
      password: "123456",
    });

    expect(res.status).toBe(409);
  });
});
