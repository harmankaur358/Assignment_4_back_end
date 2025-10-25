import { errorHandler } from "../src/api/v1/middleware/errorHandler";
import { Request, Response } from "express";
import { ServiceError } from "../src/api/v1/errors/errors";

// Mock errorResponse function
jest.mock("../src/api/v1/models/responseModel", () => ({
  errorResponse: (message: string, code: string) => ({ message, code, timestamp: new Date().toISOString() }),
}));

describe("Error Handling Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it("should handle AppError (ServiceError) correctly", () => {
    const error = new ServiceError("Service failed");

    errorHandler(error, req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Service failed",
        code: "SERVICE_ERROR",
        timestamp: expect.any(String),
      })
    );
  });

  it("should handle generic Error as INTERNAL_SERVER_ERROR", () => {
    const error = new Error("Something went wrong");

    errorHandler(error, req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        timestamp: expect.any(String),
      })
    );
  });

  it("should handle null error", () => {
    errorHandler(null, req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        timestamp: expect.any(String),
      })
    );
  });
});
