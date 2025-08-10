import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useSignUp, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

vi.mock('@clerk/nextjs', () => ({
  useSignUp: vi.fn(),
  useSignIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Authentication Components', () => {
  const mockPush = vi.fn();
  const mockSetActive = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  describe('SignUpForm', () => {
    it('should render sign up form with all fields', () => {
      const mockSignUp = {
        isLoaded: true,
        signUp: {
          create: vi.fn(),
          prepareEmailAddressVerification: vi.fn(),
        },
        setActive: mockSetActive,
      };
      (useSignUp as any).mockReturnValue(mockSignUp);

      render(<SignUpForm />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('should handle successful sign up', async () => {
      const mockSignUp = {
        isLoaded: true,
        signUp: {
          create: vi.fn().mockResolvedValue({}),
          prepareEmailAddressVerification: vi.fn().mockResolvedValue({}),
          attemptEmailAddressVerification: vi.fn().mockResolvedValue({
            status: 'complete',
            createdSessionId: 'session-123',
          }),
        },
        setActive: mockSetActive,
      };
      (useSignUp as any).mockReturnValue(mockSignUp);

      render(<SignUpForm />);

      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockSignUp.signUp.create).toHaveBeenCalledWith({
          emailAddress: 'john@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        });
      });
    });

    it('should display error message on sign up failure', async () => {
      const mockSignUp = {
        isLoaded: true,
        signUp: {
          create: vi.fn().mockRejectedValue({
            errors: [{ message: 'Email already exists' }],
          }),
        },
        setActive: mockSetActive,
      };
      (useSignUp as any).mockReturnValue(mockSignUp);

      render(<SignUpForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('LoginForm', () => {
    it('should render login form with all fields', () => {
      const mockSignIn = {
        isLoaded: true,
        signIn: {
          create: vi.fn(),
        },
        setActive: mockSetActive,
      };
      (useSignIn as any).mockReturnValue(mockSignIn);

      render(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
      const mockSignIn = {
        isLoaded: true,
        signIn: {
          create: vi.fn().mockResolvedValue({
            status: 'complete',
            createdSessionId: 'session-123',
          }),
        },
        setActive: mockSetActive,
      };
      (useSignIn as any).mockReturnValue(mockSignIn);

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockSignIn.signIn.create).toHaveBeenCalledWith({
          identifier: 'john@example.com',
          password: 'password123',
        });
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'session-123' });
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should display error message on login failure', async () => {
      const mockSignIn = {
        isLoaded: true,
        signIn: {
          create: vi.fn().mockRejectedValue({
            errors: [{ message: 'Invalid credentials' }],
          }),
        },
        setActive: mockSetActive,
      };
      (useSignIn as any).mockReturnValue(mockSignIn);

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });
});