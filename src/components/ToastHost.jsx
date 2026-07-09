import React from 'react';

export default function ToastHost({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-xl border px-4 py-3 shadow-lg text-sm backdrop-blur ${
            toast.type === 'error'
              ? 'border-red-500/20 bg-red-500/10 text-red-100'
              : toast.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                : 'border-slate-500/20 bg-slate-900/80 text-slate-100'
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.message ? <div className="mt-1 text-xs opacity-90">{toast.message}</div> : null}
        </div>
      ))}
    </div>
  );
}