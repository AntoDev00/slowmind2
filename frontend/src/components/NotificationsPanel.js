import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import styled from 'styled-components';

const NotificationsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #7C9A92;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationCount = styled.span`
  background-color: #7C9A92;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => {
    if (props.isPriority) return '#f0f7e0';
    return props.unread ? '#f0f7f5' : 'transparent';
  }};
  border-left: 4px solid ${props => {
    if (props.isPriority) return '#8fb573';
    return props.unread ? '#7C9A92' : 'transparent';
  }};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s ease;
  margin-bottom: ${props => props.isPriority ? '1rem' : '0'};
  box-shadow: ${props => props.isPriority ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    background-color: ${props => props.isPriority ? '#e8f3d8' : '#f8f8f8'};
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationText = styled.p`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
`;

const NotificationTime = styled.span``;

const NotificationActions = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #7C9A92;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #888;
`;

const NotificationTypeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => {
    switch(props.type) {
      case 'achievement': return '#7C9A92';
      case 'reminder': return '#f39c12';
      case 'social': return '#3498db';
      case 'system': return '#95a5a6';
      default: return '#7C9A92';
    }
  }};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  margin-right: 1rem;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#7C9A92' : '#ddd'};
  background-color: ${props => props.active ? '#7C9A92' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7C9A92;
  }
`;

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Initialize with stored notifications or fallback to these examples if none exist
  
  useEffect(() => {
    // Load notifications from the service (which uses localStorage in this demo)
    const storedNotifications = NotificationService.getNotifications();
    
    if (storedNotifications.length > 0) {
      setNotifications(storedNotifications);
    } else {
      // If no notifications exist yet, create default welcome and reminder notifications
      // This would normally happen at registration, but we add this fallback for demo purposes
      const welcomeNotification = NotificationService.createWelcomeNotification();
      const reminderNotification = NotificationService.createDailyReminderNotification('08:00');
      setNotifications([welcomeNotification, reminderNotification]);
    }
    
    setLoading(false);
  }, []);
  
  const markAsRead = (id) => {
    NotificationService.markAsRead(id);
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    NotificationService.markAllAsRead();
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const deleteNotification = (id) => {
    NotificationService.deleteNotification(id);
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const getTimeString = (time) => {
    if (!time || !(time instanceof Date)) {
      return 'Recently';
    }
    
    const now = new Date();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);
      
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationsContainer>
      <SectionTitle>
        Notifications
        {unreadCount > 0 && <NotificationCount>{unreadCount}</NotificationCount>}
      </SectionTitle>
      
      <FilterContainer>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'unread'} 
          onClick={() => setFilter('unread')}
        >
          Unread
        </FilterButton>
        <FilterButton 
          active={filter === 'achievement'} 
          onClick={() => setFilter('achievement')}
        >
          Achievements
        </FilterButton>
        <FilterButton 
          active={filter === 'reminder'} 
          onClick={() => setFilter('reminder')}
        >
          Reminders
        </FilterButton>
        <FilterButton 
          active={filter === 'social'} 
          onClick={() => setFilter('social')}
        >
          Social
        </FilterButton>
      </FilterContainer>
      
      {loading ? (
        <p>Loading notifications...</p>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState>
          <p>No notifications to display</p>
        </EmptyState>
      ) : (
        <>
          {unreadCount > 0 && (
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <ActionButton onClick={markAllAsRead}>Mark all as read</ActionButton>
            </div>
          )}
          
          <NotificationsList>
            {/* Display priority notifications first */}
            {filteredNotifications
              .filter(notification => notification.isPriority)
              .map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  unread={!notification.read}
                  isPriority={notification.isPriority}
                >
                  <NotificationHeader>
                    <NotificationTypeIcon type={notification.type}>{notification.icon}</NotificationTypeIcon>
                    <NotificationContent>
                      <NotificationTitle>{notification.title}</NotificationTitle>
                      <NotificationText>{notification.message}</NotificationText>
                      <NotificationMeta>
                        <NotificationTime>
                          {notification.recurring 
                            ? `Daily at ${notification.time instanceof Date 
                                ? `${notification.time.getHours().toString().padStart(2, '0')}:${notification.time.getMinutes().toString().padStart(2, '0')}` 
                                : '08:00'}` 
                            : getTimeString(notification.time)}
                        </NotificationTime>
                      </NotificationMeta>
                    </NotificationContent>
                  </NotificationHeader>
                  
                  <NotificationActions>
                    {!notification.read && (
                      <ActionButton onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </ActionButton>
                    )}
                    <ActionButton onClick={() => deleteNotification(notification.id)}>
                      {notification.recurring ? 'Dismiss today' : 'Delete'}
                    </ActionButton>
                  </NotificationActions>
                </NotificationItem>
              ))}

            {/* Then display regular notifications */}
            {filteredNotifications
              .filter(notification => !notification.isPriority)
              .map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  unread={!notification.read}
                >
                  <NotificationHeader>
                    <NotificationTypeIcon type={notification.type}>{notification.icon}</NotificationTypeIcon>
                    <NotificationContent>
                      <NotificationTitle>{notification.title}</NotificationTitle>
                      <NotificationText>{notification.message}</NotificationText>
                      <NotificationMeta>
                        <NotificationTime>{getTimeString(notification.time)}</NotificationTime>
                      </NotificationMeta>
                    </NotificationContent>
                  </NotificationHeader>
                  
                  <NotificationActions>
                    {!notification.read && (
                      <ActionButton onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </ActionButton>
                    )}
                    <ActionButton onClick={() => deleteNotification(notification.id)}>
                      Delete
                    </ActionButton>
                  </NotificationActions>
                </NotificationItem>
              ))}
            
          </NotificationsList>
        </>
      )}
    </NotificationsContainer>
  );
};

export default NotificationsPanel;
