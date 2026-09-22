import express from 'express';
import User from '../models/User.js';
import { logActivity } from '../models/AuditLog.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-Memory user store fallback when MongoDB is offline
const inMemoryUsers = [
  {
    _id: 'usr_admin',
    username: 'Saumya Patel',
    email: 'saumya@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is2FAEnabled: true,
    twoFactorCode: '123456'
  }
];

// Helper to find user in Mongo or memory
const findUserByUsernameOrEmail = async (identifier) => {
  if (mongoose.connection.readyState === 1) {
    return await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
  }
  return inMemoryUsers.find(
    u => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()
  );
};

// POST /api/auth/register - Register new user account
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, profilePic } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Username, email, and password are required.'
      });
    }

    const existingUser = await findUserByUsernameOrEmail(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'A user with this username or email already exists.'
      });
    }

    let newUser;
    if (mongoose.connection.readyState === 1) {
      newUser = await User.create({
        username,
        email,
        password,
        profilePic: profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        is2FAEnabled: true,
        twoFactorCode: '123456'
      });
    } else {
      newUser = {
        _id: `usr_${Date.now()}`,
        username,
        email,
        password,
        profilePic: profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        is2FAEnabled: true,
        twoFactorCode: '123456'
      };
      inMemoryUsers.push(newUser);
    }

    // Log Activity
    await logActivity({
      userId: newUser._id,
      username: newUser.username,
      action: 'USER_REGISTERED',
      details: `Registered user account for ${newUser.username} (${newUser.email})`
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please log in.',
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - Step 1 of Authentication
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Username/Email and Password are required.'
      });
    }

    const user = await findUserByUsernameOrEmail(identifier);
    if (!user || user.password !== password) {
      await logActivity({
        userId: 'unknown',
        username: identifier,
        action: 'LOGIN_FAILED',
        details: `Failed login attempt for identifier: ${identifier}`
      });

      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid credentials. Please check your username and password.'
      });
    }

    await logActivity({
      userId: user._id,
      username: user.username,
      action: 'LOGIN_STEP1_PASSED',
      details: 'Passed password check. Initiating 2-Step Authentication.'
    });

    // Return 2FA Challenge payload
    res.json({
      success: true,
      requires2FA: true,
      userId: user._id,
      username: user.username,
      message: 'Password verified. Enter your 6-digit 2FA security code.',
      hintCode: user.twoFactorCode || '123456'
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-2fa - Step 2: Verify 6-digit 2FA code
router.post('/verify-2fa', async (req, res, next) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'User ID and 2FA Code are required.'
      });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId);
    } else {
      user = inMemoryUsers.find(u => String(u._id) === String(userId));
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Resource Not Found',
        message: 'User not found'
      });
    }

    // Default code 123456 or matching user code
    const validCode = user.twoFactorCode || '123456';
    if (code.trim() !== validCode && code.trim() !== '123456') {
      await logActivity({
        userId: user._id,
        username: user.username,
        action: '2FA_FAILED',
        details: `Invalid 2FA security code entered: ${code}`
      });

      return res.status(401).json({
        success: false,
        error: '2FA Failed',
        message: 'Invalid 2FA verification code. (Default demo code is 123456)'
      });
    }

    // Success log entry
    await logActivity({
      userId: user._id,
      username: user.username,
      action: 'LOGIN_2FA_SUCCESS',
      details: `User ${user.username} successfully completed 2-Step Authentication & logged in.`
    });

    res.json({
      success: true,
      message: '2-Step Authentication successful!',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        is2FAEnabled: user.is2FAEnabled
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout - Logout user and record audit log
router.post('/logout', async (req, res, next) => {
  try {
    const { userId, username } = req.body;

    await logActivity({
      userId: userId || 'anonymous',
      username: username || 'User',
      action: 'LOGOUT',
      details: `User ${username || ''} logged out of session.`
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile-pic - Update profile picture
router.put('/profile-pic', async (req, res, next) => {
  try {
    const { userId, profilePic } = req.body;

    if (!userId || !profilePic) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'User ID and Profile Picture URL are required.'
      });
    }

    let updatedUser;
    if (mongoose.connection.readyState === 1) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic },
        { new: true }
      );
    } else {
      const userIndex = inMemoryUsers.findIndex(u => String(u._id) === String(userId));
      if (userIndex !== -1) {
        inMemoryUsers[userIndex].profilePic = profilePic;
        updatedUser = inMemoryUsers[userIndex];
      }
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Resource Not Found',
        message: 'User not found'
      });
    }

    await logActivity({
      userId: updatedUser._id,
      username: updatedUser.username,
      action: 'PROFILE_PIC_UPDATE',
      details: `Updated profile picture avatar to: ${profilePic}`
    });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
