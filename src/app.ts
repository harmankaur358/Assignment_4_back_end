//Import statements
import express, {Request, Response, Express } from "express";
import loanRoutes from "../src/api/v1/routes/loanRoutes"
import { accessLogger, errorLogger, consoleLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import userRoutes from "./api/v1/routes/userroutes"

//Express app created 
const app: Express = express();

// Logging middleware 
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

// Parsing json request
app.use(express.json());

//health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is healthy");
});

//loan routes
app.use("/api/v1/loans", loanRoutes)

app.use("/api/v1/users", userRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);


export default app;