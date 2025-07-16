import { Request } from "express";
import { PaginationParams } from "../utils/pagination";

export interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export type Message = {
  success: boolean;
  message: string;
};

export interface MetaData extends PaginationParams {
  total: number;
}

export type DataResponse<T> = {
  data: T[];
  meta: MetaData;
};
