import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();
const controller = new AuthController();

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
authRouter.post("/refresh", controller.refresh);
authRouter.post("/logout", controller.logout);

export default authRouter;
