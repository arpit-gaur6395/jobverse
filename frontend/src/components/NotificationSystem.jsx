import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function NotificationSystem() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate notifications based on user role and login
    const generateNotifications = () => {
      const newNotifications = [];

      if (user?.role === 'seeker') {
        // Job seeker notifications
        newNotifications.push({
          id: 1,
          type: 'info',
          icon: 'ℹ️',
          title: 'Application Status Updates',
          message: 'Check your application status for real-time updates on your job applications.',
          action: {
            text: 'View Applications',
            link: '/my-applications'
          }
        });
      } else if (user?.role === 'employer') {
        // Employer notifications
        newNotifications.push({
          id: 1,
          type: 'success',
          icon: '👥',
          title: 'New Applicants',
          message: 'Review and manage new job applications from candidates.',
          action: {
            text: 'View Applicants',
            link: '/employer-applications'
          }
        });
      }

      return newNotifications;
    };

    setNotifications(generateNotifications());
  }, [user]);

  // Auto-hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-24 left-4 right-4 z-40 max-w-md">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${getNotificationStyles(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5 text-lg">
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                <p className="text-sm mt-1 mb-3">{notification.message}</p>

                {notification.action && (
                  <a
                    href={notification.action.link}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors text-decoration-none"
                  >
                    {notification.action.text}
                    <span className="text-xs">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
