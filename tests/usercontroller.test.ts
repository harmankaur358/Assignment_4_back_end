// tests/userController.test.ts
import { auth } from "../src/config/firebaseConfig";
import { setUserRole, getUserDetails } from "../src/api/v1/controllers/userController";

// Mock Firebase Admin Auth
jest.mock("firebase-admin/auth", () => ({
  getAuth: () => ({
    getUser: jest.fn(),
    setCustomUserClaims: jest.fn(),
    verifyIdToken: jest.fn(),
  }),
}));

describe("Custom Claims - User Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should set custom claims correctly", async () => {
    (auth.setCustomUserClaims as jest.Mock).mockResolvedValueOnce(undefined);

    const req: any = { params: { uid: "123" }, body: { role: "officer" } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await setUserRole(req, res);

    expect(auth.setCustomUserClaims).toHaveBeenCalledWith("123", { role: "officer" });
    expect(res.json).toHaveBeenCalledWith({ message: 'Role "officer" assigned to user 123' });
  });

  it("should return 400 if role is missing", async () => {
    const req: any = { params: { uid: "123" }, body: {} };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await setUserRole(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Role is required" });
  });

  it("should get custom claims correctly", async () => {
    (auth.getUser as jest.Mock).mockResolvedValueOnce({
      uid: "123",
      email: "user@example.com",
      customClaims: { role: "officer" },
    });

    const req: any = { params: { uid: "123" } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getUserDetails(req, res);

    expect(res.json).toHaveBeenCalledWith({
      uid: "123",
      email: "user@example.com",
      roles: { role: "officer" },
    });
  });

  it("should handle errors when setting claims fails", async () => {
    (auth.setCustomUserClaims as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    const req: any = { params: { uid: "123" }, body: { role: "officer" } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await setUserRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed" });
  });

  it("should handle errors when getting user details fails", async () => {
    (auth.getUser as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    const req: any = { params: { uid: "123" } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getUserDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed" });
  });
});
