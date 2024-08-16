export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: {
    code: number;
    description: string;
  };
}

const successResponse: ApiResponse = {
  success: true,
  message: '',
  data: {},
};

const errorResponse: ApiResponse = {
  success: false,
  message: '',
  error: {
    code: 500,
    description: '',
  },
};

export function createSuccessResponse(data: any, message = ''): ApiResponse {
  return {
    ...successResponse,
    message,
    data,
  };
}

export function createErrorResponse(
  code: number,
  description: string,
  message = '',
): ApiResponse {
  return {
    ...errorResponse,
    message,
    error: {
      code,
      description,
    },
  };
}
