import React, { createContext, useContext, useState, useCallback } from 'react';

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface AlertContextType {
  addAlert: (message: string, type: Alert['type'], duration?: number) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((message: string, type: Alert['type'], duration = 5000) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setAlerts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, duration);
    }
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const getIcon = (type: Alert['type']) => {
    const size = 20;
    switch (type) {
      case 'success':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#28a745" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        );
      case 'error':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#dc3545" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
          </svg>
        );
      case 'info':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffc107" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21H23L12 2ZM13 16H11V18H13V16ZM13 10H11V14H13V10Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {children}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg shadow-lg bg-white animate-slide-in max-w-sm
              ${alert.type === 'success' ? 'text-green-700' : ''}
              ${alert.type === 'error' ? 'text-red-700' : ''}
              ${alert.type === 'info' ? 'text-blue-700' : ''}
              ${alert.type === 'warning' ? 'text-yellow-700' : ''}`}
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">{getIcon(alert.type)}</span>
              <span className="flex-1">{alert.message}</span>
              <button
                onClick={() => removeAlert(alert.id)}
                className={`ml-4
                  ${alert.type === 'success' ? 'text-green-700 hover:text-green-900' : ''}
                  ${alert.type === 'error' ? 'text-red-700 hover:text-red-900' : ''}
                  ${alert.type === 'info' ? 'text-blue-700 hover:text-blue-900' : ''}
                  ${alert.type === 'warning' ? 'text-yellow-700 hover:text-yellow-900' : ''}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};