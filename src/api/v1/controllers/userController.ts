// Import statements
import { Request, Response } from "express";
import { auth } from "../../../config/firebaseConfig";

// common type for custom claims
interface CustomClaims {
  role?: string;
  [key: string]: any;
}

// Get user details - user, officer, manager can user details
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params 
  // Checking the user details by uid in request
  try {
    const userRecord = await auth.getUser(uid);

    //Response format
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      roles: (userRecord.customClaims as CustomClaims) || {},
    });
    //Sending error of 500 if try block fails to get user details
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Set custom role - manager only
export const setUserRole = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const { role } = req.body as { role: string };

  //Sends a error if role is missing
  if (!role) {
    res.status(400).json({ error: "Role is required" });
    return;
  }

  try {
    // Set the custom claim
    await auth.setCustomUserClaims(uid, { role });

    // Invalidate existing tokens
    await auth.revokeRefreshTokens(uid);

    res.json({
      message: `Role "${role}" set for user ${uid}. Please sign in again to refresh token.`,
    });
    //Returns error message if try block fails
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
