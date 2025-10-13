import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #7C9A92;
  margin-bottom: 1.5rem;
`;

const ProfileForm = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #7C9A92;
  }
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
  max-width: 200px;

  &:hover {
    background-color: #65807A;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.bgColor || '#7C9A92'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-right: 2rem;
`;

const ProfileUploadButton = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileSection = () => {
  const { currentUser, setCurrentUser, isLoading } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    preferences: {
      reminderTime: '08:00',
      dailyGoal: 15
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Aggiorna profileData quando currentUser cambia e non è più null
  React.useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        preferences: currentUser.preferences || {
          reminderTime: '08:00',
          dailyGoal: 15
        }
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested object (preferences)
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value
        }
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${currentUser.id}`, profileData);
      setCurrentUser({
        ...currentUser,
        ...response.data
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    if (!profileData.username) return '?';
    return profileData.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ProfileContainer>
      <SectionTitle>Profile Settings</SectionTitle>
      
      {isLoading ? (
        <div>Loading profile information...</div>
      ) : !currentUser ? (
        <div>Please login to view and edit your profile.</div>
      ) : (
        <>
          <ProfilePictureContainer>
            <ProfileImage>{getInitials()}</ProfileImage>
            <ProfileUploadButton>
              <Button as="label" htmlFor="profile-pic-upload">
                Change Profile Picture
              </Button>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={() => alert('Profile picture upload functionality would be implemented here')}
              />
            </ProfileUploadButton>
          </ProfilePictureContainer>
      
      <ProfileForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={profileData.username}
            onChange={handleChange}
            placeholder="Your username"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="Your email address"
            disabled // Email changes typically require verification
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="bio">Bio</Label>
          <Input
            as="textarea"
            id="bio"
            name="bio"
            value={profileData.bio || ''}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself and your meditation practice"
            style={{ height: '100px' }}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="preferences.reminderTime">Daily Reminder Time</Label>
          <Input
            type="time"
            id="preferences.reminderTime"
            name="preferences.reminderTime"
            value={profileData.preferences?.reminderTime || '08:00'}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="preferences.dailyGoal">Daily Meditation Goal (minutes)</Label>
          <Input
            type="number"
            id="preferences.dailyGoal"
            name="preferences.dailyGoal"
            value={profileData.preferences?.dailyGoal || 15}
            onChange={handleChange}
            min="1"
            max="180"
          />
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ProfileForm>
        </>
      )}
    </ProfileContainer>
  );
};

export default ProfileSection;
