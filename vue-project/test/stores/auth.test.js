import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../src/stores/auth.js';

// ── Mock the authAPI module ───────────────────────────────────────────────────---
vi.mock('../../src/api/authApi.js', () => {
  const mockAuthAPI = {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
    getCurrentUser: vi.fn(),
    checkUsername: vi.fn(),
    checkEmail: vi.fn(),
    isAuthenticated: vi.fn(),
  };
  return { authAPI: mockAuthAPI };
});

// We need the mock reference after vi.mock hoists it.
// Dynamic import works because the mock is already registered.
let authAPI;

beforeEach(async () => {
  // Create a fresh Pinia instance for each test
  setActivePinia(createPinia());

  // Dynamically import the mocked module so we can set return values
  authAPI = (await import('../../src/api/authApi.js')).authAPI;
});

// ── Mock payloads ──────────────────────────────────────────────────────────────---
const mockUser = {
  user_id: 3,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role_id: 3,
};

const mockToken = 'jwt-test-token-123';

const mockRegisterResponse = {
  user: mockUser,
  token: mockToken,
  message: 'Registration successful',
};

const mockLoginResponse = {
  user: mockUser,
  token: mockToken,
  message: 'Login successful',
};

// ── Tests ──────────────────────────────────────────────────────────────────────---
describe('authStore — Registration', () => {
  it('registers a user and updates state on success', async () => {
    authAPI.register.mockResolvedValue(mockRegisterResponse);

    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    };

    const store = useAuthStore();
    const result = await store.register(userData);

    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe(mockToken);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(authAPI.register).toHaveBeenCalledWith(userData);
  });

  it('sets error state on registration failure', async () => {
    const errorResponse = {
      response: {
        data: { message: 'Email already exists' },
      },
    };
    authAPI.register.mockRejectedValue(errorResponse);

    const store = useAuthStore();
    const result = await store.register({
      username: 'testuser',
      email: 'existing@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already exists');
    expect(store.error).toBe('Email already exists');
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.loading).toBe(false);
  });

  it('handles network errors during registration', async () => {
    authAPI.register.mockRejectedValue(new Error('Network Error'));

    const store = useAuthStore();
    const result = await store.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Registration failed');
    expect(store.loading).toBe(false);
  });
});

describe('authStore — Login', () => {
  it('logs in with email and updates state on success', async () => {
    authAPI.login.mockResolvedValue(mockLoginResponse);

    const store = useAuthStore();
    const result = await store.login({
      identifier: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe(mockToken);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('logs in with username and updates state on success', async () => {
    authAPI.login.mockResolvedValue(mockLoginResponse);

    const store = useAuthStore();
    const result = await store.login({
      identifier: 'testuser',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(store.user).toEqual(mockUser);
    expect(authAPI.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('sets error state on invalid credentials', async () => {
    const errorResponse = {
      response: {
        data: { message: 'Invalid credentials' },
        status: 401,
      },
    };
    authAPI.login.mockRejectedValue(errorResponse);

    const store = useAuthStore();
    const result = await store.login({
      identifier: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
    expect(store.error).toBe('Invalid credentials');
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.loading).toBe(false);
  });

  it('handles network errors during login', async () => {
    authAPI.login.mockRejectedValue(new Error('Network Error'));

    const store = useAuthStore();
    const result = await store.login({
      identifier: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network Error');
    expect(store.loading).toBe(false);
  });
});

describe('authStore — Logout', () => {
  it('clears user, token, and error on logout', async () => {
    // Set initial logged-in state
    authAPI.login.mockResolvedValue(mockLoginResponse);
    const store = useAuthStore();
    await store.login({ identifier: 'test@example.com', password: 'password123' });

    expect(store.token).toBeTruthy();

    // Now logout
    store.logout();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBeNull();
    expect(authAPI.logout).toHaveBeenCalled();
  });
});

describe('authStore — Init', () => {
  it('restores session from localStorage when token and user exist', () => {
    authAPI.getToken.mockReturnValue(mockToken);
    authAPI.getCurrentUser.mockReturnValue(mockUser);

    const store = useAuthStore();
    store.init();

    expect(store.token).toBe(mockToken);
    expect(store.user).toEqual(mockUser);
  });

  it('does nothing when localStorage has no token', () => {
    authAPI.getToken.mockReturnValue(null);
    authAPI.getCurrentUser.mockReturnValue(null);

    const store = useAuthStore();
    store.init();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });
});

describe('authStore — Helpers', () => {
  it('clears error state', () => {
    const store = useAuthStore();
    store.error = 'Some error';
    store.clearError();
    expect(store.error).toBeNull();
  });

  it('isAuthenticated returns true when token exists', () => {
    const store = useAuthStore();
    store.token = mockToken;
    expect(store.isAuthenticated).toBe(true);
  });

  it('isAuthenticated returns false when token is null', () => {
    const store = useAuthStore();
    store.token = null;
    expect(store.isAuthenticated).toBe(false);
  });
});
