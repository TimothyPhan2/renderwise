import { NextResponse } from 'next/server';

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export function handleAuthError(error: unknown): NextResponse {
  console.error('Auth error:', error);

  if (error instanceof AuthError) {
    return NextResponse.json(
      { 
        error: 'Authentication Error',
        message: error.message,
        statusCode: error.statusCode
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: 'Authentication Failed',
        message: error.message,
        statusCode: 401
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      error: 'Authentication Failed',
      message: 'An unexpected error occurred during authentication',
      statusCode: 500
    },
    { status: 500 }
  );
}

export function createStandardErrorResponse(
  message: string,
  statusCode: number = 400,
  details?: unknown
): NextResponse {
  const response: Record<string, unknown> = {
    error: true,
    message,
    statusCode
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status: statusCode });
}