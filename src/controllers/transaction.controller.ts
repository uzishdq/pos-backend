import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { insertTransactionSchema } from "../utils/schema/transaction.schema";
import { errorResponse, successResponse } from "../utils/responseHelper";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async create(req: Request, res: Response) {
    try {
      const parse = insertTransactionSchema.safeParse(req.body);

      if (!parse.success) {
        throw parse.error;
      }

      const result = await this.transactionService.create(parse.data);
      return successResponse(res, "Transaction created", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.transactionService.getAll();
      return successResponse(res, "Transactions fetched", result);
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
