import { Response, Request } from "express";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { ProductService } from "../services/product.service";
import {
  insertProductSchema,
  updateOrDeleteProductSchema,
} from "../utils/schema/product.schema";

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.productService.findAll();

      return successResponse(res, "Products fetched", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const result = await this.productService.findById(id);

      return successResponse(res, "Products fetched", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parse = insertProductSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      const result = await this.productService.create(parse.data);

      return successResponse(res, "Product Created", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parse = updateOrDeleteProductSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      const result = await this.productService.update(parse.data);

      return successResponse(res, "Product Updated", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const parse = updateOrDeleteProductSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      await this.productService.delete(parse.data);

      return successResponse(res, "Product Deleted");
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
