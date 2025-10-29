import request from "supertest";
import express, { Express } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import errorHandler from "../src/api/v1/middleware/errorHandler";

//  Mock Firebase Admin
jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

import { auth } from "../src/config/firebaseConfig";

describe("Authentication Middleware", () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());

    // Protected route
    app.get("/protected", authenticate, (req, res) => {
      res.status(200).json({
        message: "Access Granted",
        uid: res.locals.uid,
        role: res.locals.role,
      });
    });

    // Add your error handler here
    app.use(errorHandler);
  });

  it("should allow access when a valid token is provided", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user123",
      role: "admin",
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer validToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Access Granted",
      uid: "user123",
      role: "admin",
    });
  });

  it("should return an authentication error when no token is provided", async () => {
  const response = await request(app).get("/protected");

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.error.message).toContain("No token");
  expect(response.body.error.code).toBe("TOKEN_NOT_FOUND");
});

it("should return an authentication error for an invalid token", async () => {
  (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("auth/invalid-token"));

  const response = await request(app)
    .get("/protected")
    .set("Authorization", "Bearer invalidToken");

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.error.message).toContain("Unauthorized");
  expect(response.body.error.code).toBe("TOKEN_INVALID");
});

});
