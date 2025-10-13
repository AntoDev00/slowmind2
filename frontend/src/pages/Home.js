import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  background-color: #FCF4E7;
  color: #333;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #7C9A92;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(Link)`
  padding: 12px 24px;
  border-radius: 25px;
  background-color: ${props => props.primary ? '#7C9A92' : 'transparent'};
  border: ${props => props.primary ? 'none' : '2px solid #7C9A92'};
  color: ${props => props.primary ? 'white' : '#7C9A92'};
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeaturesSection = styled.div`
  padding: 5rem 2rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: #7C9A92;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #7C9A92;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 1rem;
`;

const MeditationTipsSection = styled.div`
  padding: 5rem 2rem;
  background-color: #f8f9fa;
`;

const TipsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TipCard = styled.div`
  display: flex;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TipNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #7C9A92;
  margin-right: 2rem;
  min-width: 60px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const TipContent = styled.div`
  flex: 1;
`;

const TipTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #333;
`;

const TipText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TestimonialsSection = styled.div`
  padding: 5rem 2rem;
  background-color: #FCF4E7;
  text-align: center;
`;

const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  text-align: left;
`;

const QuoteSymbol = styled.div`
  font-size: 3rem;
  line-height: 1;
  color: #7C9A92;
  opacity: 0.5;
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  color: #333;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #7C9A92;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #333;
`;

const AuthorTitle = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const Home = () => {
  return (
    <>
      <HeroSection>
        <Title>Find Your Inner Peace</Title>
        <Subtitle>
          Slow Mind helps you reduce stress, improve focus, and sleep better
          through guided meditations and mindfulness practices.
        </Subtitle>
        <ButtonContainer>
          <Button to="/register" primary>Get Started</Button>
          <Button to="/login">Login</Button>
        </ButtonContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Slow Mind?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🧘</FeatureIcon>
            <FeatureTitle>Guided Meditations</FeatureTitle>
            <p>Access a variety of guided meditations for different needs and preferences.</p>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Track Your Progress</FeatureTitle>
            <p>Monitor your meditation journey with detailed statistics and insights.</p>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>Daily Reminders</FeatureTitle>
            <p>Set reminders to maintain consistency in your mindfulness practice.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <MeditationTipsSection>
        <SectionTitle>Features of Effective Meditation</SectionTitle>
        <TipsContainer>
          <TipCard>
            <TipNumber>1</TipNumber>
            <TipContent>
              <TipTitle>Proper Posture</TipTitle>
              <TipText>
                Maintain a straight back while sitting comfortably. Whether on a cushion, chair, or mat, 
                your spine should be erect but not rigid, allowing for natural breathing and energy flow.
              </TipText>
            </TipContent>
          </TipCard>
          
          <TipCard>
            <TipNumber>2</TipNumber>
            <TipContent>
              <TipTitle>Breath Awareness</TipTitle>
              <TipText>
                Focus on your breath as it moves in and out naturally. Don't force it—simply observe 
                the sensation of breathing, using it as an anchor for your attention when the mind wanders.
              </TipText>
            </TipContent>
          </TipCard>
          
          <TipCard>
            <TipNumber>3</TipNumber>
            <TipContent>
              <TipTitle>Non-judgmental Awareness</TipTitle>
              <TipText>
                When thoughts arise (and they will), acknowledge them without judgment or attachment. 
                Gently return your focus to your breath or chosen point of concentration without self-criticism.
              </TipText>
            </TipContent>
          </TipCard>
          
          <TipCard>
            <TipNumber>4</TipNumber>
            <TipContent>
              <TipTitle>Consistency & Routine</TipTitle>
              <TipText>
                Meditate regularly, ideally at the same time each day. Even five minutes daily is more 
                beneficial than an hour once a week. Consistency builds the mental muscle that makes meditation more effective.
              </TipText>
            </TipContent>
          </TipCard>
        </TipsContainer>
      </MeditationTipsSection>

      <TestimonialsSection>
        <SectionTitle>What Our Users Say</SectionTitle>
        <TestimonialsContainer>
          <TestimonialCard>
            <QuoteSymbol>❝</QuoteSymbol>
            <TestimonialText>
              Slow Mind has transformed my daily routine. The guided meditations are perfect for beginners like me, 
              and I'm sleeping better than I have in years!
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>MA</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Maria A.</AuthorName>
                <AuthorTitle>Practicing for 3 months</AuthorTitle>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <QuoteSymbol>❝</QuoteSymbol>
            <TestimonialText>
              As someone with high anxiety, I've tried many meditation apps. Slow Mind stands out with its 
              clean interface and variety of meditation types. The timer feature is exactly what I needed.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>JK</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>James K.</AuthorName>
                <AuthorTitle>Practicing for 6 months</AuthorTitle>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <QuoteSymbol>❝</QuoteSymbol>
            <TestimonialText>
              I love how Slow Mind tracks my progress! Seeing my meditation streak motivates me to practice 
              daily. The body scan meditations have helped tremendously with my chronic pain.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>SL</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Sofia L.</AuthorName>
                <AuthorTitle>Practicing for 1 year</AuthorTitle>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsContainer>
      </TestimonialsSection>
    </>
  );
};

export default Home;
