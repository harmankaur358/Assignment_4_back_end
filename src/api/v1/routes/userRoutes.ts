// src/routes.ts
import express from "express";
import { getUserDetails, setUserRole } from "../controllers/userController";
import isAuthorized from "../middleware/authorize";

const router = express.Router();

// User route
router.get("/:uid", isAuthorized({ hasRole: ["user", "officer", "manager"], allowSameUser: true }), getUserDetails);

// Admin route to set role
router.post("/admin/set-role/:uid",setUserRole);

export default router;
