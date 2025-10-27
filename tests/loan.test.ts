import request from "supertest";
import app from "../src/app";

// Dynamic role variable for each test
let mockRole = "user";

// Global mock for authentication middleware
jest.mock("../src/api/v1/middleware/authenticate", () => {
  return (req: any, res: any, next: any) => {
    res.locals.uid = "123";
    res.locals.role = mockRole; // use dynamic role
    next();
  };
});

describe("Loan Endpoints", () => {

  it("Should create a loan", async () => {
    mockRole = "user"; // user can create loan
    const response = await request(app).post("/api/v1/loans");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Loan application is submitted successfully.");
  });

  it("Should return all loans", async () => {
    mockRole = "manager"; // manager or officer can get loans
    const response = await request(app).get("/api/v1/loans");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("List of all loan applications");
  });

  it("Should review a loan", async () => {
    mockRole = "officer"; // only officer can review
    const response = await request(app).put("/api/v1/loans/123/review");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been reviewed.");
  });

  it("Should approve a loan", async () => {
    mockRole = "manager"; // only manager can approve
    const response = await request(app).put("/api/v1/loans/123/approve");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been approved.");
  });

});
