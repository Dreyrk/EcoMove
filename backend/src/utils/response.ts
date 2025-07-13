export const successResponse = <T>(data: T, meta?: object) => {
  const response: any = {
    status: "success",
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

export const errorResponse = (message: string) => {
  return {
    status: "error",
    message,
  };
};
