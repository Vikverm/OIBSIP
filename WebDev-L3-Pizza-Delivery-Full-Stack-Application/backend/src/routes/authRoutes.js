import { Router } from 'express';
import * as c from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const r = Router();

// User registration
r.post('/register', c.register);

// Email verification
r.get('/verify/:token', c.verifyEmail);

// Normal user login
r.post('/login', c.login);

// Separate admin login
r.post('/admin/login', c.adminLogin);

// Forgot password
r.post('/forgot-password', c.forgotPassword);

// Reset password
r.post('/reset-password/:token', c.resetPassword);

// Get currently logged-in user
r.get('/me', protect, c.me);

export default r;