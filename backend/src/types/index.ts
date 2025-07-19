import { PaginationParams } from "../utils/pagination";

export interface TokenPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

export type Message = {
  success: boolean;
  message: string;
};

export interface MetaData extends PaginationParams {
  total: number;
}

export interface DataResponse<T> {
  data: T;
  meta?: MetaData;
}
