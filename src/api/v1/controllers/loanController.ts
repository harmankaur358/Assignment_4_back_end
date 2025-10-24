import { Request, Response } from "express";

// create loan
export const createLoan = (req: Request, res: Response) => {
  res.status(201).json({
    message: "Loan application is submitted successfully."
  });
};

// get loans
export const getLoans = (req: Request, res: Response) => {
  res.json({
    message: "List of all loan applications"
  });
};

// review loan
export const reviewLoan = (req: Request, res: Response) => {
  res.json({
    message: `Loan ${req.params.id} has been reviewed.`
  });
};

// approve loan
export const approveLoan = (req: Request, res: Response) => {
  res.json({
    message: `Loan ${req.params.id} has been approved.`
  });
};
