//Import statements
import express, {Request, Response, Express } from "express";
import morgan from "morgan";
import loanRoutes from "../src/api/v1/routes/loanRoutes"

//Express app created 
const app: Express = express();

// Parsing json request
app.use(express.json());

// HTTP request logging with Morgan
app.use(morgan("combined"));

//health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is healthy");
});

//loan routes
app.use("/api/v1/loans", loanRoutes)

export default app;