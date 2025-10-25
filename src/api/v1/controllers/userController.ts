// src/controllers/userController.ts
import { Request, Response } from "express";
import { auth } from "../../../config/firebaseConfig"; // <-- use auth, not admin

// Get user details
export const getUserDetails = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const userRecord = await auth.getUser(uid); // use auth
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      roles: userRecord.customClaims || {},
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Set custom role (admin only)
export const setUserRole = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { role } = req.body as { role: string };

  try {
    await auth.setCustomUserClaims(uid, { role }); // use auth
    res.json({ message: `Role "${role}" set for user ${uid}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
