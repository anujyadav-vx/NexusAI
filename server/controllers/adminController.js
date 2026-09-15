import { db } from '../services/dbAdapter.js';

export const getAdminOverview = (req, res) => {
  try {
    const users = db.getCollection('users').map(u => {
      const { passwordHash: _, ...safeUser } = u;
      return safeUser;
    });

    const subscriptions = db.getCollection('subscriptions');
    const aiRequests = db.getCollection('aiRequests');
    const auditLogs = db.getCollection('auditLogs');

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    const totalTokens = users.reduce((sum, u) => sum + (u.tokensUsed || 0), 0);

    return res.json({
      success: true,
      data: {
        metrics: {
          totalUsers: users.length,
          activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
          monthlyRecurringRevenue: `$${totalRevenue}.00`,
          totalPlatformTokens: totalTokens,
          totalAiGenerations: aiRequests.length + 24
        },
        users,
        auditLogs: auditLogs.slice(0, 20)
      }
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin overview.' });
  }
};

export const updateUserRole = (req, res) => {
  try {
    const { userId } = req.params;
    const { role, plan } = req.body;

    const user = db.findById('users', userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updates = {};
    if (role && ['user', 'admin'].includes(role)) updates.role = role;
    if (plan && ['free', 'pro', 'enterprise'].includes(plan)) updates.plan = plan;

    const updated = db.update('users', userId, updates);

    // Add audit log
    db.insert('auditLogs', {
      id: `log_${Date.now()}`,
      action: 'ADMIN_USER_MODIFICATION',
      actor: req.user.email,
      details: `Updated user ${user.email} (Role: ${updated.role}, Plan: ${updated.plan})`,
      timestamp: new Date().toISOString()
    });

    const { passwordHash: _, ...safeUser } = updated;
    return res.json({
      success: true,
      message: 'User updated successfully.',
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
};

export const deleteUser = (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const targetUser = db.findById('users', userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    db.delete('users', userId);

    db.insert('auditLogs', {
      id: `log_${Date.now()}`,
      action: 'ADMIN_USER_DELETE',
      actor: req.user.email,
      details: `Deleted user ${targetUser.email}`,
      timestamp: new Date().toISOString()
    });

    return res.json({ success: true, message: `User ${targetUser.email} was successfully deleted.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};
