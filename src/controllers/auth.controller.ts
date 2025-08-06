import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../utils/schema/auth.schema";
import { errorResponse, successResponse } from "../utils/responseHelper";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const parse = registerSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      await this.authService.register(parse.data);

      return successResponse(res, "User Registered");
    } catch (error) {
      return errorResponse(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const parse = loginSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      const result = await this.authService.login(parse.data);

      return successResponse(res, "Login Success", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      const accessToken = await this.authService.refreshToken(refreshToken);

      return successResponse(res, "Refresh Success", accessToken);
    } catch (error) {
      return errorResponse(res, error);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      await this.authService.logout(token);

      return successResponse(res, "Logged Out");
    } catch (error) {
      return errorResponse(res, error);
    }
  };
}
