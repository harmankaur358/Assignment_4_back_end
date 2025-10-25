import request from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { accessLogger, errorLogger, consoleLogger } from "../src/api/v1/middleware/logger";

jest.mock("fs");

describe("Logging Middleware", () => {
  let app: express.Express;
  const logsDir = path.join(__dirname, "../../logs");
  const accessLogPath = path.join(logsDir, "access.log");
  const errorLogPath = path.join(logsDir, "error.log");

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(accessLogger);
    app.use(errorLogger);
    app.use(consoleLogger);

    // Dummy routes
    app.get("/success", (req, res) => res.status(200).send("OK"));
    app.get("/fail", (req, res) => res.status(500).send("Error"));
  });

  it("should log all requests to access log", async () => {
    await request(app).get("/success");

    expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
  });

  it("should log only failed requests to error log", async () => {
    const appendSpy = jest.spyOn(fs, "appendFileSync").mockImplementation();

    await request(app).get("/fail");

    expect(appendSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalledWith(
      expect.stringContaining(errorLogPath),
      expect.any(String)
    );
  });

  it("should NOT write to error log for successful requests", async () => {
    const appendSpy = jest.spyOn(fs, "appendFileSync").mockImplementation();

    await request(app).get("/success");

    expect(appendSpy).not.toHaveBeenCalled();
  });

  it("should use console logger in development", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await request(app).get("/success");

    // Morgan 'dev' logger writes to console
    expect(consoleSpy).toHaveBeenCalled();
  });
});
