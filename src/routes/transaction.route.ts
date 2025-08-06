import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { TransactionController } from "../controllers/transaction.controller";

const transactionRouter = Router();
const controller = new TransactionController();

transactionRouter.post(
  "/create",
  authenticate,
  authorize(["ADMIN", "CASHIER"]),
  controller.create.bind(controller)
);

transactionRouter.get("/", authenticate, controller.getAll.bind(controller));

export default transactionRouter;
