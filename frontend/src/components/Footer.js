import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #FCF4E7;
  border-top: 1px solid #e0dcd5;
  padding: 2rem 1rem;
  margin-top: 3rem;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLogo = styled(Link)`
  color: #7C9A92;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: #7C9A92;
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  color: #777;
  font-size: 0.85rem;
  text-align: center;
  margin: 0.5rem 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const SocialIcon = styled.a`
  color: #7C9A92;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const CurrentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo to="/">Slow Mind</FooterLogo>
        
        <FooterLinks>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
        </FooterLinks>
        
        <SocialLinks>
          <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </SocialIcon>
          <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </SocialIcon>
          <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </SocialIcon>
        </SocialLinks>
        
        <FooterText>&copy; {CurrentYear} Slow Mind. All rights reserved.</FooterText>
        <FooterText>Slow Mind is a meditation app dedicated to improving mental wellness and mindfulness.</FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
