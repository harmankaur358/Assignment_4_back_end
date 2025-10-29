import request from "supertest";
import app from "../src/app";

// Dynamic role variable for each test
let mockRole: string | null = "user"; // can be null for unauthenticated

// Global mock for authentication middleware
jest.mock("../src/api/v1/middleware/authenticate", () => {
  return (req: any, res: any, next: any) => {
    if (!mockRole) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized: No token provided", code: "TOKEN_NOT_FOUND" },
      });
    }
    res.locals.uid = "123";
    res.locals.role = mockRole;
    next();
  };
});

describe("Loan Endpoints - Authentication & Authorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Success Scenarios
  it("Should create a loan (user)", async () => {
    mockRole = "user";
    const response = await request(app).post("/api/v1/loans");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Loan application is submitted successfully.");
  });

  it("Should return all loans (manager)", async () => {
    mockRole = "manager";
    const response = await request(app).get("/api/v1/loans");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("List of all loan applications");
  });

  it("Should review a loan (officer)", async () => {
    mockRole = "officer";
    const response = await request(app).put("/api/v1/loans/123/review");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been reviewed.");
  });

  it("Should approve a loan (manager)", async () => {
    mockRole = "manager";
    const response = await request(app).put("/api/v1/loans/123/approve");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been approved.");
  });

  //  Missing Authentication (401)
  it("Should return 401 when no token is provided", async () => {
    mockRole = null; // simulate missing auth
    const response = await request(app).post("/api/v1/loans");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("TOKEN_NOT_FOUND");
  });

  //  Insufficient Role (403)
  it("Should return 403 when role is insufficient", async () => {
    mockRole = "user"; // user not allowed to approve
    const response = await request(app).put("/api/v1/loans/123/approve");
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("INSUFFICIENT_ROLE");
  });
});
