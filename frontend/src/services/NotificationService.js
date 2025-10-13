// Notification service for managing user notifications
import axios from 'axios';

// In a real app, these would be API calls to a backend service
// For this demo, we'll use local storage to persist notifications between sessions

const NotificationService = {
  // Get all notifications for the current user
  getNotifications: () => {
    const storedNotifications = localStorage.getItem('notifications');
    if (!storedNotifications) return [];
    
    // Parse the stored notifications and convert date strings back to Date objects
    const notifications = JSON.parse(storedNotifications);
    return notifications.map(notification => {
      if (notification.time && typeof notification.time === 'string') {
        notification.time = new Date(notification.time);
      }
      return notification;
    });
  },

  // Add a new notification
  addNotification: (notification) => {
    const notifications = NotificationService.getNotifications();
    const newNotification = {
      id: Date.now(), // Simple ID generation
      time: new Date(),
      read: false,
      ...notification
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    return newNotification;
  },

  // Create a welcome notification for new users
  createWelcomeNotification: (username) => {
    return NotificationService.addNotification({
      type: 'system',
      title: 'Welcome to Slow Mind!',
      message: `Thank you for joining our meditation community, ${username || 'User'}. Start your mindfulness journey today with a quick meditation session.`,
      icon: '👋',
      isPriority: true
    });
  },

  // Create a daily meditation reminder notification
  createDailyReminderNotification: (time = '08:00') => {
    // Convert time string to Date object set to today at the specified time
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    return NotificationService.addNotification({
      type: 'reminder',
      title: 'Daily Meditation Reminder',
      message: 'It\'s time for your daily meditation session. Even 5 minutes can make a big difference in your day.',
      icon: '⏰',
      isPriority: true,
      recurring: 'daily',
      time: reminderTime
    });
  },

  // Mark a notification as read
  markAsRead: (notificationId) => {
    const notifications = NotificationService.getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    const notifications = NotificationService.getNotifications();
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  },

  // Delete a notification
  deleteNotification: (notificationId) => {
    const notifications = NotificationService.getNotifications();
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  },

  // Get unread notification count
  getUnreadCount: () => {
    const notifications = NotificationService.getNotifications();
    return notifications.filter(notification => !notification.read).length;
  }
};

export default NotificationService;
