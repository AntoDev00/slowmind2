import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import CongratulationsModal from '../components/CongratulationsModal';

const MeditateContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const PageTitle = styled.h1`
  color: #7C9A92;
  margin-bottom: 2rem;
`;

const TimerDisplay = styled.div`
  font-size: 6rem;
  font-weight: 700;
  color: #7C9A92;
  margin: 2rem 0;
`;

const TypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TypeCard = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  border: ${props => props.selected ? '3px solid #7C9A92' : '1px solid transparent'};

  &:hover {
    transform: translateY(-5px);
  }
`;

const TypeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const TypeName = styled.div`
  font-weight: 600;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const DurationSelector = styled.div`
  margin-bottom: 2rem;
`;

const DurationLabel = styled.div`
  margin-bottom: 1rem;
  font-weight: 600;
`;

const DurationButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CustomDurationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const CustomDurationInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 80px;
  text-align: center;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #7C9A92;
  }
`;

const DurationButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.selected ? '#7C9A92' : '#f1f1f1'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.selected ? '#65807A' : '#e1e1e1'};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  background-color: #7C9A92;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #65807A;
  }
`;

const NoteContainer = styled.div`
  margin-top: 2rem;
`;

const NoteLabel = styled.div`
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: left;
`;

const NoteTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #7C9A92;
  }
`;

const QuoteDisplay = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  font-style: italic;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 1rem 0;
`;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Meditate = () => {
  const { currentUser } = useContext(AuthContext);
  const [meditationType, setMeditationType] = useState('mindfulness');
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0); // To track the actual time spent meditating

  // Meditation types
  const meditationTypes = [
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'breathing', name: 'Breathing', icon: '🌬️' },
    { id: 'body-scan', name: 'Body Scan', icon: '👁️' },
    { id: 'loving-kindness', name: 'Loving Kindness', icon: '❤️' }
  ];

  // Duration options in seconds
  const durationOptions = [
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 }
  ];

  // Custom duration input
  const [customMinutes, setCustomMinutes] = useState('');

  useEffect(() => {
    // Fetch a random quote when component mounts
    const fetchQuote = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Make request with authorization header
        const response = await axios.get('http://localhost:5000/api/quotes', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setQuote(response.data[randomIndex]);
        }
      } catch (err) {
        console.error('Error fetching quote:', err);
        // Not setting error state here as it's not critical
      }
    };

    // Only fetch quote if user is authenticated
    if (currentUser) {
      fetchQuote();
    }
  }, [currentUser]);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsCompleted(true);
            setSessionDuration(duration);
            setShowCongratulationsModal(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    setShowCongratulationsModal(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeRemaining(duration);
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setShowCongratulationsModal(false);
  };

  const handleComplete = async () => {
    try {
      await axios.post('http://localhost:5000/api/meditations', {
        duration: (duration - timeRemaining) / 60, // Convert to minutes
        type: meditationType,
        notes: notes
      });
      
      // Don't reset immediately - this will be handled after modal interactions
      setShowCongratulationsModal(true);
    } catch (err) {
      console.error('Error saving meditation session:', err);
      setError('Failed to save your meditation session. Please try again.');
    }
  };

  // Handle starting a new session after completing one
  const handleStartNewSession = () => {
    setTimeRemaining(duration);
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    setShowCongratulationsModal(false);
    setNotes('');
  };

  // Handle closing the modal without starting a new session
  const handleCloseModal = () => {
    setTimeRemaining(duration);
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setShowCongratulationsModal(false);
    setNotes('');
  };

  return (
    <MeditateContainer>
      {showCongratulationsModal && (
        <CongratulationsModal
          onClose={handleCloseModal}
          onStartNew={handleStartNewSession}
          sessionDuration={sessionDuration}
        />
      )}
      <PageTitle>Mindful Meditation</PageTitle>
      
      <TypeSelector>
        {meditationTypes.map(type => (
          <TypeCard 
            key={type.id}
            selected={meditationType === type.id}
            onClick={() => setMeditationType(type.id)}
          >
            <TypeIcon>{type.icon}</TypeIcon>
            <TypeName>{type.name}</TypeName>
          </TypeCard>
        ))}
      </TypeSelector>
      
      <DurationSelector>
        <DurationLabel>Choose Duration</DurationLabel>
        <DurationButtonGroup>
          {durationOptions.map(option => (
            <DurationButton
              key={option.value}
              selected={duration === option.value && !customMinutes}
              onClick={() => {
                if (!isActive) {
                  setDuration(option.value);
                  setCustomMinutes('');
                }
              }}
              disabled={isActive}
            >
              {option.label}
            </DurationButton>
          ))}
        </DurationButtonGroup>
        <CustomDurationContainer>
          <CustomDurationInput
            type="number"
            min="1"
            max="120"
            placeholder="Min"
            value={customMinutes}
            onChange={(e) => {
              if (!isActive) {
                const value = e.target.value;
                setCustomMinutes(value);
                if (value && !isNaN(value) && value > 0) {
                  setDuration(parseInt(value) * 60); // Convert minutes to seconds
                }
              }
            }}
            disabled={isActive}
          />
          <DurationLabel>minutes</DurationLabel>
          {customMinutes && (
            <Button 
              onClick={() => {
                if (!isActive) {
                  setCustomMinutes('');
                  setDuration(300); // Reset to 5 minutes default
                }
              }}
              disabled={isActive}
              style={{ padding: '0.5rem', fontSize: '0.9rem' }}
            >
              Clear
            </Button>
          )}
        </CustomDurationContainer>
      </DurationSelector>
      
      <TimerDisplay>{formatTime(timeRemaining)}</TimerDisplay>
      
      <ControlsContainer>
        {!isActive && !isCompleted && (
          <Button onClick={handleStart}>
            Start
          </Button>
        )}
        
        {isActive && !isPaused && (
          <Button onClick={handlePause}>
            Pause
          </Button>
        )}
        
        {isActive && isPaused && (
          <>
            <Button onClick={handleResume}>
              Resume
            </Button>
            <Button onClick={handleReset}>
              Reset
            </Button>
          </>
        )}
        
        {isCompleted && (
          <Button onClick={handleComplete}>
            Save Session
          </Button>
        )}
      </ControlsContainer>
      
      {isCompleted && (
        <NoteContainer>
          <NoteLabel>How was your session? (Optional)</NoteLabel>
          <NoteTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add some notes about your meditation experience..."
          />
        </NoteContainer>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {quote && (
        <QuoteDisplay>
          "{quote.text}"
        </QuoteDisplay>
      )}
    </MeditateContainer>
  );
};

export default Meditate;
