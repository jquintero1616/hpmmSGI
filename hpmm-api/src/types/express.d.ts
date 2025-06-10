import { Request } from "express";
import { Pagination } from "../../middlewares/pagination.middleware";


declare global {
  namespace Express {
    interface Request {
      /** El middleware pagination() inyecta este objeto */
      pagination?: Pagination;
    }
  }
}
export interface AuthResponse {
  token: string;
  userId: string;
}
