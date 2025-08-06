import express from "express";
import authRouter from "../routes/auth.route";
import productRouter from "../routes/product.route";
import transactionRouter from "../routes/transaction.route";

export function createTestApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/transactions", transactionRouter);

  return app;
}
