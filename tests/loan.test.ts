import request from "supertest";
import app from "../src/app";

describe("Loan Endpoints", () => {

  it("Should create a loan", async () => {
    // Arrange & Act
    const response = await request(app).post("/api/v1/loans");

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Loan application is submitted successfully.");
  });

  it("Should return all loans", async () => {
    // Arrange & Act
    const response = await request(app).get("/api/v1/loans");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("List of all loan applications");
  });

  it("Should review a loan", async () => {
    // Arrange & Act
    const response = await request(app).put("/api/v1/loans/123/review");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been reviewed.");
  });

  it("Should approve a loan", async () => {
    // Arrange & Act
    const response = await request(app).put("/api/v1/loans/123/approve");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Loan 123 has been approved.");
  });

});
