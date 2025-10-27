// tests/isAuthorized.test.ts
import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("Authorization Middleware", () => {
  const createMock = (role: string | undefined, uid: string, id: string) => {
    const req = { params: { id } } as Partial<Request>;
    const res = { locals: { role, uid } } as Partial<Response>;
    const next = jest.fn();
    return { req, res, next };
  };

  test("allows access for proper role", () => {
    const { req, res, next } = createMock("manager", "456", "123");
    isAuthorized({ hasRole: ["manager", "officer"] })(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test("denies access for insufficient role", () => {
    const { req, res, next } = createMock("user", "456", "123");
    isAuthorized({ hasRole: ["manager", "officer"] })(req as Request, res as Response, next);
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AuthorizationError);
    expect(error.code).toBe("INSUFFICIENT_ROLE");
  });

  test("allows same-user access", () => {
    const { req, res, next } = createMock("user", "123", "123");
    isAuthorized({ hasRole: ["manager"], allowSameUser: true })(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
