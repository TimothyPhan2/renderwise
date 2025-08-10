import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH } from '@/app/api/user-profile/route';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock('convex/browser', () => ({
  ConvexHttpClient: vi.fn().mockImplementation(() => ({
    setAuth: vi.fn(),
    query: vi.fn(),
    mutation: vi.fn(),
  })),
}));

describe('User Profile API Routes', () => {
  let mockConvexClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConvexClient = {
      setAuth: vi.fn(),
      query: vi.fn(),
      mutation: vi.fn(),
    };
    (ConvexHttpClient as any).mockImplementation(() => mockConvexClient);
  });

  describe('GET /api/user-profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      (auth as any).mockResolvedValue({ userId: null });
      (currentUser as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/user-profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Authentication required');
    });

    it('should return existing user profile', async () => {
      const mockUser = {
        id: 'clerk-123',
        emailAddresses: [{ emailAddress: 'john@example.com' }],
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockDbUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        email: 'john@example.com',
        name: 'John Doe',
      };

      (auth as any).mockResolvedValue({ 
        userId: 'clerk-123',
        getToken: vi.fn().mockResolvedValue('mock-token'),
      });
      (currentUser as any).mockResolvedValue(mockUser);
      mockConvexClient.query.mockResolvedValue(mockDbUser);

      const request = new NextRequest('http://localhost:3000/api/user-profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockDbUser);
      expect(data.isNew).toBe(false);
    });

    it('should create new user if not exists', async () => {
      const mockUser = {
        id: 'clerk-123',
        emailAddresses: [{ emailAddress: 'jane@example.com' }],
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const newUserId = 'new-user-123';
      const createdUser = {
        _id: newUserId,
        clerkId: 'clerk-123',
        email: 'jane@example.com',
        name: 'Jane Smith',
      };

      (auth as any).mockResolvedValue({ 
        userId: 'clerk-123',
        getToken: vi.fn().mockResolvedValue('mock-token'),
      });
      (currentUser as any).mockResolvedValue(mockUser);
      mockConvexClient.query
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createdUser);
      mockConvexClient.mutation.mockResolvedValue(newUserId);

      const request = new NextRequest('http://localhost:3000/api/user-profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockConvexClient.mutation).toHaveBeenCalledWith(
        expect.anything(),
        {
          clerkId: 'clerk-123',
          email: 'jane@example.com',
          name: 'Jane Smith',
        }
      );
      expect(data.user).toEqual(createdUser);
      expect(data.isNew).toBe(true);
    });
  });

  describe('PATCH /api/user-profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/user-profile', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Authentication required');
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        youtubeChannelId: 'channel-123',
        youtubeChannelName: 'My Channel',
      };

      const updatedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        email: 'john@example.com',
        name: 'John Doe',
        youtubeChannelId: 'channel-123',
        youtubeChannelName: 'My Channel',
      };

      (auth as any).mockResolvedValue({ 
        userId: 'clerk-123',
        getToken: vi.fn().mockResolvedValue('mock-token'),
      });
      mockConvexClient.mutation.mockResolvedValue(undefined);
      mockConvexClient.query.mockResolvedValue(updatedUser);

      const request = new NextRequest('http://localhost:3000/api/user-profile', {
        method: 'PATCH',
      });
      request.json = vi.fn().mockResolvedValue(updateData);
      
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockConvexClient.mutation).toHaveBeenCalledWith(
        expect.anything(),
        {
          youtubeChannelId: 'channel-123',
          youtubeChannelName: 'My Channel',
        }
      );
      expect(data.user).toEqual(updatedUser);
      expect(data.success).toBe(true);
    });

    it('should handle partial updates correctly', async () => {
      const updateData = {
        stripeCustomerId: 'stripe-customer-123',
      };

      const updatedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        email: 'john@example.com',
        name: 'John Doe',
        stripeCustomerId: 'stripe-customer-123',
      };

      (auth as any).mockResolvedValue({ 
        userId: 'clerk-123',
        getToken: vi.fn().mockResolvedValue('mock-token'),
      });
      mockConvexClient.mutation.mockResolvedValue(undefined);
      mockConvexClient.query.mockResolvedValue(updatedUser);

      const request = new NextRequest('http://localhost:3000/api/user-profile', {
        method: 'PATCH',
      });
      request.json = vi.fn().mockResolvedValue(updateData);
      
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockConvexClient.mutation).toHaveBeenCalledWith(
        expect.anything(),
        {
          stripeCustomerId: 'stripe-customer-123',
        }
      );
    });
  });
});