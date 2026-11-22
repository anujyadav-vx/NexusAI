import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  CreditCard,
  Check,
  Download,
  Zap,
  Receipt,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
};

export default function BillingPage() {
  const { user, refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const [plansRes, invoicesRes] = await Promise.all([
          api.getPlans(),
          api.getInvoices(),
        ]);

        if (!active) return;

        if (plansRes.success) {
          setPlans(Array.isArray(plansRes.plans) ? plansRes.plans : []);
        }

        if (invoicesRes.success) {
          setInvoices(
            Array.isArray(invoicesRes.invoices) ? invoicesRes.invoices : [],
          );
        }
      } catch (err) {
        if (active) {
          console.error("Failed to load billing data", err);
          addToast("Failed to load billing information.", "error");
        }
      } finally {
        if (active) setLoadingData(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const handleUpgrade = async (planId) => {
    if (user?.plan === planId || loadingPlan) return;

    setLoadingPlan(planId);

    try {
      const res = await api.upgradePlan(planId);

      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        await refreshUserData();
        addToast(res.message || "Plan updated successfully.", "success");
      } else {
        throw new Error(res.message || "Upgrade failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to update plan.", "error");
    } finally {
      setLoadingPlan(null);
    }
  };

  const tokensUsed = Math.max(0, Number(user?.tokensUsed) || 0);
  const tokenLimit = Math.max(0, Number(user?.tokenLimit) || 5000);

  const percentUsed =
    tokenLimit > 0
      ? Math.min(100, Math.round((tokensUsed / tokenLimit) * 100))
      : 0;

  const currentPlan = plans.find((plan) => plan.id === user?.plan);

  const handleReceipt = (invoice) => {
    addToast(
      `Receipt download is not connected yet for ${invoice.id}.`,
      "info",
    );
  };

  if (loadingData) {
    return (
      <div className="billing-state">
        <LoaderCircle size={22} className="billing-spinner" />
        <span>Loading billing information...</span>
      </div>
    );
  }

  return (
    <main className="billing-page">
      {/* Header */}
      <header className="billing-header">
        <div className="billing-heading">
          <div className="billing-heading-icon">
            <CreditCard size={19} />
          </div>

          <div>
            <div className="billing-eyebrow">ACCOUNT MANAGEMENT</div>
            <h1>Plans & Billing</h1>
          </div>
        </div>

        <p className="billing-description">
          Manage your subscription, monitor token usage, and review your billing
          history.
        </p>
      </header>

      {/* Current Plan */}
      <section className="billing-current-card">
        <div className="billing-current-info">
          <div className="billing-current-label">
            <span className="billing-status-dot" />
            CURRENT SUBSCRIPTION
          </div>

          <h2>
            {user?.plan
              ? `${String(user.plan).toUpperCase()} Plan`
              : "Free Plan"}
          </h2>

          <p>
            {formatNumber(tokensUsed)} of {formatNumber(tokenLimit)} monthly
            tokens used
          </p>

          {currentPlan && (
            <div className="billing-current-price">
              ${currentPlan.price}
              <span> / {currentPlan.interval}</span>
            </div>
          )}
        </div>

        <div className="billing-usage">
          <div className="billing-usage-header">
            <span>Token usage</span>
            <strong>{percentUsed}%</strong>
          </div>

          <div
            className="billing-progress-track"
            role="progressbar"
            aria-valuenow={percentUsed}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Monthly token usage"
          >
            <div
              className={`billing-progress-fill ${
                percentUsed > 85 ? "billing-progress-warning" : ""
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <div className="billing-usage-footer">
            <span>0 tokens</span>
            <span>{formatNumber(tokenLimit)} tokens</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="billing-section">
        <div className="billing-section-header">
          <div>
            <h2>Available plans</h2>
            <p>Choose the allowance that fits your usage.</p>
          </div>

          <span className="billing-section-count">
            {plans.length} {plans.length === 1 ? "PLAN" : "PLANS"}
          </span>
        </div>

        {plans.length === 0 ? (
          <div className="billing-empty">
            <CreditCard size={24} />
            <h3>No plans available</h3>
            <p>Subscription plans could not be loaded.</p>
          </div>
        ) : (
          <div className="billing-plans-grid">
            {plans.map((plan) => {
              const isCurrent = user?.plan === plan.id;
              const isPro = plan.id === "pro";
              const features = Array.isArray(plan.features)
                ? plan.features
                : [];

              return (
                <article
                  key={plan.id}
                  className={`billing-plan-card ${
                    isCurrent ? "billing-plan-current" : ""
                  } ${isPro ? "billing-plan-pro" : ""}`}
                >
                  {isCurrent && (
                    <span className="billing-current-badge">CURRENT PLAN</span>
                  )}

                  <div className="billing-plan-content">
                    <div className="billing-plan-name">
                      {isPro && <Sparkles size={15} />}
                      {plan.name}
                    </div>

                    <div className="billing-plan-price">
                      <span>${plan.price}</span>
                      <small>/{plan.interval}</small>
                    </div>

                    <p className="billing-plan-tokens">
                      <Zap size={14} />
                      {formatNumber(plan.tokenLimit)} monthly tokens
                    </p>

                    <div className="billing-plan-divider" />

                    <div className="billing-features-label">
                      WHAT'S INCLUDED
                    </div>

                    <ul className="billing-features">
                      {features.map((feature, index) => (
                        <li key={`${plan.id}-${index}`}>
                          <span className="billing-feature-check">
                            <Check size={13} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || loadingPlan !== null}
                    className={`billing-plan-button ${
                      isCurrent
                        ? "billing-button-current"
                        : isPro || plan.id === "enterprise"
                          ? "billing-button-primary"
                          : "billing-button-secondary"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <LoaderCircle size={15} className="billing-spinner" />
                        Processing...
                      </>
                    ) : isCurrent ? (
                      <>
                        <Check size={15} />
                        Active subscription
                      </>
                    ) : (
                      `Switch to ${plan.name}`
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Invoice History */}
      <section className="billing-section billing-invoices-section">
        <div className="billing-section-header">
          <div className="billing-invoice-heading">
            <div className="billing-invoice-icon">
              <Receipt size={17} />
            </div>

            <div>
              <h2>Billing history</h2>
              <p>Review your previous invoices and payments.</p>
            </div>
          </div>

          <span className="billing-section-count">
            {invoices.length} INVOICES
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="billing-empty">
            <Receipt size={24} />
            <h3>No invoices yet</h3>
            <p>Your billing history will appear here.</p>
          </div>
        ) : (
          <div className="billing-table-wrapper">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>INVOICE ID</th>
                  <th>BILLING DATE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th className="billing-receipt-heading">RECEIPT</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="billing-invoice-id">{invoice.id}</td>

                    <td className="billing-date">{invoice.date}</td>

                    <td className="billing-amount">{invoice.amount}</td>

                    <td>
                      <span
                        className={`billing-invoice-status ${
                          String(invoice.status).toLowerCase() === "paid"
                            ? "billing-status-paid"
                            : "billing-status-other"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="billing-receipt-button"
                        onClick={() => handleReceipt(invoice)}
                      >
                        <Download size={14} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
