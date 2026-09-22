import React from 'react';

const ToastNotification = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <div className="toast-icon">
            {toast.type === 'success' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
            {toast.type === 'danger' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            )}
          </div>
          <div className="toast-content">
            {toast.title && <h5 className="toast-title">{toast.title}</h5>}
            <p className="toast-message">{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => onDismiss(toast.id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
