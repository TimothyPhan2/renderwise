import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { useAuthStore } from '@/store/authStore';

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock('convex/react', () => ({
  useConvexAuth: vi.fn(),
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('useAuth Hook', () => {
  const mockSetUser = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSetAuthenticated = vi.fn();
  const mockCreateUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuthStore as any).mockReturnValue({
      setUser: mockSetUser,
      setLoading: mockSetLoading,
      setAuthenticated: mockSetAuthenticated,
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('should handle unauthenticated state', () => {
    (useClerkAuth as any).mockReturnValue({
      isLoaded: true,
      userId: null,
      sessionId: null,
    });
    
    (useUser as any).mockReturnValue({
      user: null,
      isLoaded: true,
    });
    
    (useConvexAuth as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    
    (useQuery as any).mockReturnValue("skip");
    (useMutation as any).mockReturnValue(mockCreateUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.userId).toBe(null);
  });

  it('should handle authenticated state with existing user', async () => {
    const mockDbUser = {
      _id: 'user-123',
      clerkId: 'clerk-123',
      email: 'john@example.com',
      name: 'John Doe',
    };

    (useClerkAuth as any).mockReturnValue({
      isLoaded: true,
      userId: 'clerk-123',
      sessionId: 'session-123',
    });
    
    (useUser as any).mockReturnValue({
      user: {
        id: 'clerk-123',
        firstName: 'John',
        lastName: 'Doe',
        emailAddresses: [{ emailAddress: 'john@example.com' }],
      },
      isLoaded: true,
    });
    
    (useConvexAuth as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    
    (useQuery as any).mockReturnValue(mockDbUser);
    (useMutation as any).mockReturnValue(mockCreateUser);

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockDbUser);
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should create new user if not exists in database', async () => {
    const newUserId = 'new-user-123';
    mockCreateUser.mockResolvedValue(newUserId);

    (useClerkAuth as any).mockReturnValue({
      isLoaded: true,
      userId: 'clerk-123',
      sessionId: 'session-123',
    });
    
    (useUser as any).mockReturnValue({
      user: {
        id: 'clerk-123',
        firstName: 'Jane',
        lastName: 'Smith',
        emailAddresses: [{ emailAddress: 'jane@example.com' }],
      },
      isLoaded: true,
    });
    
    (useConvexAuth as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    
    (useQuery as any).mockReturnValue(null);
    (useMutation as any).mockReturnValue(mockCreateUser);

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        clerkId: 'clerk-123',
        email: 'jane@example.com',
        name: 'Jane Smith',
      });
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  it('should handle loading states correctly', () => {
    (useClerkAuth as any).mockReturnValue({
      isLoaded: false,
      userId: null,
      sessionId: null,
    });
    
    (useUser as any).mockReturnValue({
      user: null,
      isLoaded: false,
    });
    
    (useConvexAuth as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });
    
    (useQuery as any).mockReturnValue("skip");
    (useMutation as any).mockReturnValue(mockCreateUser);

    renderHook(() => useAuth());

    expect(mockSetLoading).toHaveBeenCalledWith(true);
  });
});