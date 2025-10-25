import {
  AppError,
  RepositoryError,
  ServiceError,
  AuthenticationError,
  AuthorizationError
} from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Custom Error Classes", () => {

  it("AppError should create an error with message, code, and statusCode", () => {
    const error = new AppError("Base error", "BASE_ERROR", 500);
    expect(error.message).toBe("Base error");
    expect(error.code).toBe("BASE_ERROR");
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe("AppError");
  });

  it("RepositoryError should default statusCode to 500", () => {
    const error = new RepositoryError("Repo failed", "REPO_ERROR");
    expect(error.message).toBe("Repo failed");
    expect(error.code).toBe("REPO_ERROR");
    expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(error.name).toBe("RepositoryError");
  });

  it("ServiceError should default code and statusCode", () => {
    const error = new ServiceError("Service failed");
    expect(error.message).toBe("Service failed");
    expect(error.code).toBe("SERVICE_ERROR");
    expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(error.name).toBe("ServiceError");
  });

  it("AuthenticationError should default code and statusCode", () => {
    const error = new AuthenticationError("Invalid token");
    expect(error.message).toBe("Invalid token");
    expect(error.code).toBe("AUTHENTICATION_ERROR");
    expect(error.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(error.name).toBe("AuthenticationError");
  });

  it("AuthorizationError should default code and statusCode", () => {
    const error = new AuthorizationError("No permission");
    expect(error.message).toBe("No permission");
    expect(error.code).toBe("AUTHORIZATION_ERROR");
    expect(error.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(error.name).toBe("AuthorizationError");
  });

});
