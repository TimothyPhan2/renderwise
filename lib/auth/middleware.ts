import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export type AuthenticatedRequest = NextRequest & {
  auth: {
    userId: string;
    sessionId: string;
  };
};

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<(req: NextRequest) => Promise<NextResponse>> {
  return async (req: NextRequest) => {
    try {
      const { userId, sessionId } = await auth();

      if (!userId || !sessionId) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        );
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.auth = { userId, sessionId };

      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed', message: 'Invalid authentication credentials' },
        { status: 401 }
      );
    }
  };
}