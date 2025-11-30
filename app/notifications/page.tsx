'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notification-context';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Notification } from '@/lib/types';

type FilterType = 'all' | 'unread' | 'event_registration' | 'event_reminder' | 'mentor_assigned' | 'profile_reminder' | 'resume_reminder';

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const filterOptions: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '📋' },
    { value: 'unread', label: 'Unread', icon: '🔵' },
    { value: 'event_registration', label: 'Registrations', icon: '✅' },
    { value: 'event_reminder', label: 'Reminders', icon: '⏰' },
    { value: 'mentor_assigned', label: 'Mentor', icon: '🎓' },
    { value: 'profile_reminder', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {notifications.filter(n => !n.read).length} unread notification{notifications.filter(n => !n.read).length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition"
          >
            Mark All as Read
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === option.value
                    ? 'bg-maroon-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-500 text-lg">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event_registration':
        return 'bg-green-100 text-green-700';
      case 'event_reminder':
        return 'bg-orange-100 text-orange-700';
      case 'mentor_assigned':
        return 'bg-purple-100 text-purple-700';
      case 'profile_reminder':
        return 'bg-blue-100 text-blue-700';
      case 'resume_reminder':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
        !notification.read ? 'border-l-4 border-maroon-500' : ''
      } hover:shadow-lg`}
    >
      <div className="p-4 cursor-pointer" onClick={handleClick}>
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="text-3xl mr-4">{notification.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <h3 className="font-semibold text-gray-900 mr-2">{notification.title}</h3>
                {!notification.read && (
                  <span className="inline-block w-2 h-2 bg-maroon-500 rounded-full animate-pulse" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>
                  {new Date(notification.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className={`px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                  {notification.type.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Mark as read"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && notification.actionUrl && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href={notification.actionUrl}
              className="inline-flex items-center px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {notification.actionText || 'View'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
