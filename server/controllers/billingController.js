import { db } from '../services/dbAdapter.js';

export const PLANS = {
  free: {
    id: 'free',
    name: 'Starter Free',
    price: 0,
    interval: 'forever',
    tokenLimit: 5000,
    features: [
      '5,000 Monthly AI Tokens',
      'Standard Model Access',
      'Basic Code Review & Chat',
      'Community Support'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    tokenLimit: 50000,
    features: [
      '50,000 Monthly AI Tokens',
      'Full Access to All 7 AI Tools',
      'Ultra-Fast Streaming Responses',
      'High Resolution Image Generation',
      'Priority Email & Slack Support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Ultra',
    price: 99,
    interval: 'month',
    tokenLimit: 1000000,
    features: [
      '1,000,000 Monthly AI Tokens',
      'Dedicated Custom LLM Fine-Tuning',
      'Unlimited Document Summaries',
      'Team Workspaces & Role RBAC',
      '24/7 Dedicated Account Architect'
    ]
  }
};

export const getPlans = (req, res) => {
  return res.json({
    success: true,
    plans: Object.values(PLANS)
  });
};

export const upgradePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan selected.' });
    }

    const selectedPlan = PLANS[planId];

    // Update user plan & token limit
    const updatedUser = db.update('users', req.user.id, {
      plan: planId,
      tokenLimit: selectedPlan.tokenLimit
    });

    // Create or update subscription entry
    let existingSub = db.findOne('subscriptions', s => s.userId === req.user.id);
    if (existingSub) {
      db.update('subscriptions', existingSub.id, {
        plan: planId,
        status: 'active',
        amount: selectedPlan.price,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } else {
      db.insert('subscriptions', {
        id: `sub_${Date.now()}`,
        userId: req.user.id,
        plan: planId,
        status: 'active',
        amount: selectedPlan.price,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Audit log
    db.insert('auditLogs', {
      id: `log_${Date.now()}`,
      action: 'SUBSCRIPTION_UPGRADE',
      actor: req.user.email,
      details: `Upgraded subscription to ${selectedPlan.name} ($${selectedPlan.price}/mo)`,
      timestamp: new Date().toISOString()
    });

    const { passwordHash: _, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      message: `Successfully upgraded to ${selectedPlan.name}!`,
      user: safeUser,
      plan: selectedPlan
    });
  } catch (error) {
    console.error('Upgrade plan error:', error);
    return res.status(500).json({ success: false, message: 'Subscription upgrade failed.' });
  }
};

export const getInvoices = (req, res) => {
  const mockInvoices = [
    {
      id: 'inv_2026_09',
      date: '2026-09-01',
      amount: req.user.plan === 'enterprise' ? '$99.00' : req.user.plan === 'pro' ? '$29.00' : '$0.00',
      status: 'Paid',
      pdfUrl: '#'
    },
    {
      id: 'inv_2026_08',
      date: '2026-08-01',
      amount: req.user.plan === 'enterprise' ? '$99.00' : req.user.plan === 'pro' ? '$29.00' : '$0.00',
      status: 'Paid',
      pdfUrl: '#'
    }
  ];

  return res.json({
    success: true,
    invoices: mockInvoices
  });
};
