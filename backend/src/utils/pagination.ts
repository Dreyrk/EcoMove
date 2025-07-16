import { Request } from "express";

export interface PaginationParams {
  page: number;
  per_page: number;
  skip: number;
  take: number;
}

// Récupère les paramètres de pagination à partir de la requête.
export const getPagination = (req: Request, defaultPerPage = 20): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const per_page = Math.max(1, parseInt(req.query.per_page as string) || defaultPerPage);

  return {
    page,
    per_page,
    skip: (page - 1) * per_page,
    take: per_page,
  };
};
