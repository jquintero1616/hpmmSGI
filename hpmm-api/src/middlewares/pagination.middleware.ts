// src/middlewares/pagination.middleware.ts
import { Request, Response, NextFunction } from "express";

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

declare module "express-serve-static-core" {
  interface Request {
    pagination?: Pagination;
  }
}

export const pagination = (defaultLimit = 10, maxLimit = 100) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || defaultLimit;

    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;

    const offset = (page - 1) * limit;
    req.pagination = { page, limit, offset };
    next();
  };
};
