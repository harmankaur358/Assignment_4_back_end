import request from "supertest";
import express, { Express } from "express";
import { accessLogger, errorLogger } from "../src/api/v1/middleware/logger";
import fs from "fs";

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    end: jest.fn(),
  })),
  appendFileSync: jest.fn(),
}));

describe("Logging Middleware", () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks(); 
    app = express();
    app.use(express.json());
    app.use(accessLogger);
    app.use(errorLogger);

    app.get("/success", (_req, res) => res.status(200).send("OK"));
    app.get("/fail", (_req, res) => res.status(500).send("Fail"));
  });

  it("should log only failed requests to error.log", async () => {
    await request(app).get("/fail");
    expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
  });

  it("should not log errors for successful requests", async () => {
    await request(app).get("/success");
    expect(fs.appendFileSync).not.toHaveBeenCalled(); // ✅ should pass now
  });
});
