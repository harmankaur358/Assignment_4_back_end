// Import statements
import { Request, Response } from "express";

// loanRequestParams
interface LoanRequestParams {
  id?: string;
}

// Create loan - user can create a loan
export const createLoan = (req: Request, res: Response): void => {
  res
    .status(201)
    .json({ message: "Loan application is submitted successfully." });
};

// Get all loans - officer and manager can get all loans
export const getLoans = (req: Request, res: Response): void => {
  res
    .status(200)
    .json({ message: "List of all loan applications" });
};

// Review loan - only officer can review loan
export const reviewLoan = (req: Request<LoanRequestParams>, res: Response): void => {
  res
    .status(200)
    .json({ message: `Loan ${req.params.id} has been reviewed.` });
};

// Approve loan- only manager can approve loan
export const approveLoan = (req: Request<LoanRequestParams>, res: Response): void => {
  res
    .status(200)
    .json({ message: `Loan ${req.params.id} has been approved.` });
};
