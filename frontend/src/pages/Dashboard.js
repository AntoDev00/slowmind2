import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import ProfileSection from '../components/ProfileSection';
import MessageBoard from '../components/MessageBoard';
import NotificationsPanel from '../components/NotificationsPanel';
import QuoteService from '../services/QuoteService';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#7C9A92' : 'transparent'};
  color: ${props => props.active ? '#7C9A92' : '#333'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #7C9A92;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const NotificationIndicator = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeHeader = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  color: #7C9A92;
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #7C9A92;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
`;

const QuotesSection = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const QuoteTitle = styled.h2`
  color: #7C9A92;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuoteDate = styled.span`
  font-size: 1rem;
  font-weight: normal;
  color: #888;
`;

const QuoteCard = styled.div`
  border-left: 4px solid #7C9A92;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
`;

const QuoteText = styled.p`
  font-style: italic;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: #7C9A92;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #65807A;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [quoteOfDay, setQuoteOfDay] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock number of unread notifications

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch daily quote using the QuoteService
        const dailyQuote = await QuoteService.getQuoteOfTheDay();
        setQuoteOfDay(dailyQuote);
        
        // Fetch meditation sessions if API is ready
        try {
          const sessionsResponse = await axios.get('http://localhost:5000/api/meditations');
          setSessions(sessionsResponse.data);
        } catch (sessionError) {
          console.error('Error fetching meditation sessions:', sessionError);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load your dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculated stats
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  return (
    <DashboardContainer>
      <WelcomeHeader>
        <WelcomeTitle>Welcome back, {currentUser?.username || 'User'}!</WelcomeTitle>
        <p>Track your meditation progress and find your inner peace.</p>
      </WelcomeHeader>

      <TabsContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Tab>
        <Tab 
          active={activeTab === 'community'} 
          onClick={() => setActiveTab('community')}
        >
          Community Board
        </Tab>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
          {unreadNotifications > 0 && <NotificationIndicator>{unreadNotifications}</NotificationIndicator>}
        </Tab>
      </TabsContainer>

      <TabContent active={activeTab === 'overview'}>
        <StatsContainer>
          <StatCard>
            <StatValue>{totalSessions}</StatValue>
            <StatLabel>Total Sessions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalMinutes}</StatValue>
            <StatLabel>Total Minutes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageSessionLength}</StatValue>
            <StatLabel>Avg. Session (min)</StatLabel>
          </StatCard>
        </StatsContainer>

        <QuotesSection>
          <QuoteTitle>
            Quote of the Day
            <QuoteDate>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</QuoteDate>
          </QuoteTitle>
          {loading ? (
            <p>Loading your daily inspiration...</p>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : quoteOfDay ? (
            <QuoteCard>
              <QuoteText>"{quoteOfDay.text}"</QuoteText>
            </QuoteCard>
          ) : (
            <p>No quote available today. Check back tomorrow!</p>
          )}
        </QuotesSection>

        <Button onClick={() => window.location.href = '/meditate'}>
          Start Meditating
        </Button>
      </TabContent>

      <TabContent active={activeTab === 'profile'}>
        <ProfileSection />
      </TabContent>

      <TabContent active={activeTab === 'community'}>
        <MessageBoard />
      </TabContent>

      <TabContent active={activeTab === 'notifications'}>
        <NotificationsPanel />
      </TabContent>
    </DashboardContainer>
  );
};

export default Dashboard;
