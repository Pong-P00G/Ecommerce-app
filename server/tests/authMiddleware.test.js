import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock jsonwebtoken before importing the middleware
vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn(),
    },
}));

// Mock process.env
const ORIGINAL_JWT_SECRET = process.env.JWT_SECRET;
beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
});
afterAll(() => {
    process.env.JWT_SECRET = ORIGINAL_JWT_SECRET;
});

import jwt from 'jsonwebtoken';
import protect, { isAdmin, isUser } from '../src/middleware/authMiddleWare.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create mock req, res, next objects.
 * Returns them in a tuple so tests can assert on all three.
 */
function createMocks(token = null, user = null) {
    const req = {
        headers: token ? { authorization: `Bearer ${token}` } : {},
        user: user || null,
    };
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();
    return { req, res, next };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  protect middleware
// ═══════════════════════════════════════════════════════════════════════════════

describe('protect middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('attaches user to req and calls next() when token is valid', async () => {
        const decoded = { id: 1, role_id: 1 };
        jwt.verify.mockReturnValue(decoded);

        const { req, res, next } = createMocks('valid-token');
        await protect(req, res, next);

        expect(req.user).toEqual({ id: 1, role_id: 1 });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 401 when no token is provided', async () => {
        const { req, res, next } = createMocks(null);
        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('no token') })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when token is expired or invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('jwt expired');
        });

        const { req, res, next } = createMocks('expired-token');
        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('token failed') })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when Authorization header has no Bearer prefix', async () => {
        const req = {
            headers: { authorization: 'Basic somebase64' },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        const next = vi.fn();

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when JWT_SECRET env var is missing', async () => {
        delete process.env.JWT_SECRET;
        jwt.verify.mockImplementation(() => {
            throw new Error('secret not found');
        });

        const { req, res, next } = createMocks('some-token');
        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        process.env.JWT_SECRET = 'test-secret-key';
    });

    it('calls jwt.verify with the correct secret', async () => {
        jwt.verify.mockReturnValue({ id: 5, role_id: 3 });

        const { req, res, next } = createMocks('my-token');
        await protect(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('my-token', 'test-secret-key');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  isAdmin middleware
// ═══════════════════════════════════════════════════════════════════════════════

describe('isAdmin middleware', () => {
    it('calls next() when role_id is 1 (super admin)', () => {
        const { req, res, next } = createMocks(null, { id: 1, role_id: 1 });
        isAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('calls next() when role_id is 2 (admin)', () => {
        const { req, res, next } = createMocks(null, { id: 2, role_id: 2 });
        isAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns 403 when role_id is 3 (regular user)', () => {
        const { req, res, next } = createMocks(null, { id: 3, role_id: 3 });
        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('Admin privileges') })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 403 when role_id is undefined', () => {
        const { req, res, next } = createMocks(null, { id: 1 });
        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when req.user is missing', () => {
        const { req, res, next } = createMocks(null, null);
        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('no user found') })
        );
        expect(next).not.toHaveBeenCalled();
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  isUser middleware
// ═══════════════════════════════════════════════════════════════════════════════

describe('isUser middleware', () => {
    it('calls next() when role_id is 3 (regular user)', () => {
        const { req, res, next } = createMocks(null, { id: 10, role_id: 3 });
        isUser(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns 403 when role_id is 1 (admin)', () => {
        const { req, res, next } = createMocks(null, { id: 1, role_id: 1 });
        isUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when req.user is missing', () => {
        const { req, res, next } = createMocks(null, null);
        isUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
