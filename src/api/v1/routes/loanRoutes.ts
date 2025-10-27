import { Router } from "express";
import {
  createLoan,
  getLoans,
  reviewLoan,
  approveLoan
} from "../controllers/loanController";
import isAuthorized from "../middleware/authorize";

const router = Router();

// Create loan
router.post("/",isAuthorized({hasRole: ["user"]}), createLoan);

// Get all loans
router.get("/",isAuthorized({hasRole: ["officer", "manager"]}), getLoans);

// Review loans
router.put("/:id/review",isAuthorized({hasRole: ["officer"]}), reviewLoan);

// Approve loan
router.put("/:id/approve", isAuthorized({hasRole: ["manager"]}),approveLoan);

export default router;
