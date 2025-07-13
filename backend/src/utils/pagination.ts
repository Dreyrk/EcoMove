import { Request } from "express";

export interface PaginationParams {
  page: number;
  perPage: number;
  skip: number;
  take: number;
}

// Récupère les paramètres de pagination à partir de la requête.
export const getPagination = (req: Request, defaultPerPage = 20): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.max(1, parseInt(req.query.per_page as string) || defaultPerPage);

  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
  };
};
