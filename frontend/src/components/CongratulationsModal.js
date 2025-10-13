import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #7C9A92;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin: 1rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.secondary ? '#e1e1e1' : '#7C9A92'};
  color: ${props => props.secondary ? '#333' : 'white'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.secondary ? '#d1d1d1' : '#65807A'};
  }
`;

const CongratulationsModal = ({ onClose, onStartNew, sessionDuration }) => {
  // Convert session duration from seconds to minutes for display
  const durationMinutes = Math.round(sessionDuration / 60);
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalIcon>🎉</ModalIcon>
        <ModalTitle>Congratulations!</ModalTitle>
        <ModalText>
          You've successfully completed a {durationMinutes}-minute meditation session. 
          Taking time for mindfulness is a powerful step toward inner peace and well-being.
        </ModalText>
        <ModalText>
          Would you like to continue your practice with another session?
        </ModalText>
        <ButtonContainer>
          <Button onClick={onStartNew}>Start Another Session</Button>
          <Button secondary onClick={onClose}>Return to Dashboard</Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CongratulationsModal;
