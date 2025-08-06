import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const productRouter = Router();
const controller = new ProductController();

productRouter.post(
  "/create",
  authenticate,
  authorize(["ADMIN"]),
  controller.create.bind(controller)
);

productRouter.put(
  "/update",
  authenticate,
  authorize(["ADMIN"]),
  controller.update.bind(controller)
);

productRouter.delete(
  "/delete",
  authenticate,
  authorize(["ADMIN"]),
  controller.delete.bind(controller)
);

productRouter.get("/", authenticate, controller.getAll.bind(controller));
productRouter.get("/:id", authenticate, controller.getById.bind(controller));

export default productRouter;
