import express, { Request, Response, Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userroutes";
import { accessLogger, errorLogger, consoleLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import authMiddleware from "./api/v1/middleware/authenticate";

const app: Express = express();

// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  app.use(consoleLogger);
}

// Parse JSON body
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is healthy");
});

// Apply authentication middleware before routes
app.use(authMiddleware);

// API routes
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes);

// Global error handler 
app.use(errorHandler);

export default app;
