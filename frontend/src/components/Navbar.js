import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #7C9A92;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #7C9A92;
  }
`;

const NavButton = styled.button`
  margin-left: 1.5rem;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #7C9A92;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #65807A;
  }
`;

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <Logo to="/">Slow Mind</Logo>
      <NavMenu>
        <NavLink to="/">Home</NavLink>
        {currentUser ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/meditate">Meditate</NavLink>
            <NavButton onClick={handleLogout}>Logout</NavButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </NavMenu>
    </NavbarContainer>
  );
};

export default Navbar;
