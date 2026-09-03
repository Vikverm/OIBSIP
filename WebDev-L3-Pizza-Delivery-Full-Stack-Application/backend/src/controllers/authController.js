import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import { sendMail } from '../utils/email.js';

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};


// ===============================
// USER REGISTRATION
// ===============================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const verifyToken = crypto
      .randomBytes(24)
      .toString('hex');

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      verifyToken,
    });

    await sendMail({
      to: normalizedEmail,
      subject: 'Verify your PizzaFlow email',
      html: `
        <h2>Welcome to PizzaFlow 🍕</h2>
        <p>Please verify your email address.</p>
        <a href="${process.env.CLIENT_URL}/verify/${verifyToken}">
          Verify Email
        </a>
      `,
    });

    return res.status(201).json({
      message:
        'Registered successfully. Please verify your email.',
      verifyToken:
        process.env.NODE_ENV === 'development'
          ? verifyToken
          : undefined,
    });

  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// EMAIL VERIFICATION
// ===============================
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid verification link',
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;

    await user.save();

    return res.json({
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error('Email verification error:', error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// NORMAL USER LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    // Admin must use separate admin login
    if (user.role === 'admin') {
      return res.status(403).json({
        message:
          'Please use the separate admin login page',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          'Please verify your email first',
      });
    }

    return res.json({
      token: signToken(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('User login error:', error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// SEPARATE ADMIN LOGIN
// ===============================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid admin credentials',
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Invalid admin credentials',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message:
          'You are not authorized to access the admin panel',
      });
    }

    return res.json({
      message: 'Admin login successful',

      token: signToken(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// FORGOT PASSWORD
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email
      ?.toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether email exists
    if (!user) {
      return res.json({
        message:
          'If the email exists, a reset link was sent',
      });
    }

    user.resetToken = crypto
      .randomBytes(24)
      .toString('hex');

    user.resetExpires =
      Date.now() + 60 * 60 * 1000;

    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Reset your PizzaFlow password',
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password.</p>

        <a href="${process.env.CLIENT_URL}/reset/${user.resetToken}">
          Reset Password
        </a>

        <p>This link expires in 1 hour.</p>
      `,
    });

    return res.json({
      message: 'Reset link sent',

      resetToken:
        process.env.NODE_ENV === 'development'
          ? user.resetToken
          : undefined,
    });

  } catch (error) {
    console.error(
      'Forgot password error:',
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'New password is required',
      });
    }

    const user = await User.findOne({
      resetToken: req.params.token,

      resetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          'Invalid or expired reset link',
      });
    }

    user.password = await bcrypt.hash(
      password,
      10
    );

    user.resetToken = undefined;
    user.resetExpires = undefined;

    await user.save();

    return res.json({
      message: 'Password reset successful',
    });

  } catch (error) {
    console.error(
      'Reset password error:',
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// GET CURRENT USER
// ===============================
export const me = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json(user);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};