interface SuccessResponse<T> {
  status: "success";
  data: T;
  meta?: {
    total?: number;
    totalPage?: number;
    per_page?: number;
    [key: string]: any; // Pour d'autres métadonnées optionnelles
  };
}

interface ErrorResponse {
  status: "error";
  message: string;
  data?: {
    code?: string; // Code d'erreur interne optionnel
    [key: string]: any; // Pour d'autres détails d'erreur
  };
}

export const successResponse = <T>(data: T, meta?: SuccessResponse<T>["meta"]): SuccessResponse<T> => {
  return {
    status: "success",
    data,
    ...(meta && { meta }), // Inclut les métadonnées si fournies
  };
};

export const errorResponse = (message: string, data?: ErrorResponse["data"]): ErrorResponse => {
  return {
    status: "error",
    message,
    ...(data && { data }), // Inclut les données supplémentaires si fournies
  };
};
