import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => {
          let bg = 'rgba(17, 24, 39, 0.95)';
          let border = 'rgba(255, 255, 255, 0.15)';
          let icon = <Info size={20} color="#38bdf8" />;

          if (toast.type === 'success') {
            border = 'rgba(16, 185, 129, 0.4)';
            icon = <CheckCircle2 size={20} color="#10b981" />;
          } else if (toast.type === 'error') {
            border = 'rgba(244, 63, 94, 0.4)';
            icon = <XCircle size={20} color="#f43f5e" />;
          } else if (toast.type === 'warning') {
            border = 'rgba(245, 158, 11, 0.4)';
            icon = <AlertTriangle size={20} color="#f59e0b" />;
          }

          return (
            <div
              key={toast.id}
              className="glass-panel animate-fade-in"
              style={{
                pointerEvents: 'auto',
                background: bg,
                borderColor: border,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                minWidth: '280px'
              }}
            >
              {icon}
              <div style={{ flex: 1, fontSize: '13.5px', fontWeight: 500 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
