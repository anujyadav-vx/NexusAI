import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/dbAdapter.js';
import { JWT_SECRET } from '../middlewares/authMiddleware.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      plan: 'free',
      tokensUsed: 0,
      tokenLimit: 5000,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };

    db.insert('users', newUser);

    // Initial subscription
    db.insert('subscriptions', {
      id: `sub_${Date.now()}`,
      userId: newUser.id,
      plan: 'free',
      status: 'active',
      amount: 0,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Audit log
    db.insert('auditLogs', {
      id: `log_${Date.now()}`,
      action: 'USER_REGISTER',
      actor: newUser.email,
      details: 'New user registered',
      timestamp: new Date().toISOString()
    });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account successfully registered!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Support both pre-seeded and hashed passwords
    const isValid = await bcrypt.compare(password, user.passwordHash) || 
      (user.email === 'admin@saas.ai' && password === 'Admin@123') ||
      (user.email === 'demo@saas.ai' && password === 'Demo@123');

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { passwordHash: _, ...safeUser } = req.user;
    const subscription = db.findOne('subscriptions', s => s.userId === req.user.id);
    return res.json({
      success: true,
      user: safeUser,
      subscription: subscription || { plan: 'free', status: 'active', amount: 0 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const updated = db.update('users', req.user.id, updates);
    const { passwordHash: _, ...safeUser } = updated;

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
