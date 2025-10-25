// src/routes.ts
import express from "express";
import { getUserDetails, setUserRole } from "../controllers/userController";

const router = express.Router();

// User route
router.get("/:uid", getUserDetails);

// Admin route to set role
router.post("/admin/set-role/:uid", setUserRole);

export default router;
