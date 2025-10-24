import { Router } from "express";
import {
  createLoan,
  getLoans,
  reviewLoan,
  approveLoan
} from "../controllers/loanController";

const router = Router();

// Create loan
router.post("/", createLoan);

// Get all loans
router.get("/", getLoans);

// Review loans
router.put("/:id/review", reviewLoan);

// Approve loan
router.put("/:id/approve", approveLoan);

export default router;
