import './App.css';
import React, { useState, useEffect } from 'react';
import CampaignList from './components/CampaignList';
import CampaignDetails from './components/CampaignDetails';
import CreateCampaign from './components/CreateCampaign';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import LandingPage from './components/LandingPage';
import ApplyCampaign from './components/ApplyCampaign';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';

function App() {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Always start logged out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  return (
    <div className="App">
      <Router>
        <nav style={{
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, #f8fafc 0%, #e3e8ee 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          borderRadius: '0 0 16px 16px',
          padding: '0.7rem 2.5rem',
          minHeight: 60,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <span style={{fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px', cursor: 'pointer', color: '#1976d2', userSelect: 'none', transition: 'color 0.2s'}} onClick={() => window.location.href = '/'} onMouseOver={e => e.target.style.color = '#0d47a1'} onMouseOut={e => e.target.style.color = '#1976d2'}>FundSpark</span>
            {auth.user && (
              <>
                <span style={{height: 36, width: 2, background: '#d1d5db', margin: '0 1.5rem', borderRadius: 2, display: 'inline-block'}}></span>
                <span style={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#1976d2',
                  background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)',
                  borderRadius: 20,
                  padding: '0.3rem 1.1rem',
                  boxShadow: '0 1px 4px #e3e8ee',
                  letterSpacing: 0.5,
                  border: '1px solid #e3e8ee',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                  marginRight: 12
                }}>Welcome, {auth.user.username}</span>
                {auth.user.role === 'admin' && (
                  null
                )}
                {auth.user.role !== 'admin' && (
                  <Link
                    to="/apply"
                    style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#1976d2',
                      background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)',
                      borderRadius: 20,
                      padding: '0.3rem 1.1rem',
                      boxShadow: '0 1px 4px #e3e8ee',
                      letterSpacing: 0.5,
                      border: '1px solid #e3e8ee',
                      display: 'inline-block',
                      textDecoration: 'none',
                      marginRight: 12,
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.target.style.background = '#e3e8ee'}
                    onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)'}
                  >Apply for Campaign</Link>
                )}
              </>
            )}
          </span>
          <span>
            <Tooltip title={auth.user ? (sidebarOpen ? 'Close Dashboard' : 'Open Dashboard') : 'Register / Login'} arrow>
              <Avatar style={{marginLeft: '1rem', cursor: 'pointer', background: '#1976d2', width: 44, height: 44, transition: 'box-shadow 0.2s'}} onClick={() => {
                if (auth.user) setSidebarOpen(open => !open);
                else window.location.href = '/register';
              }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 0 4px #e3e8ee'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <PersonIcon style={{color: 'white', fontSize: 28}} />
              </Avatar>
            </Tooltip>
          </span>
        </nav>
        {auth.user && sidebarOpen && <UserDashboard onClose={() => setSidebarOpen(false)} />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/create" element={auth.user && auth.user.role === 'admin' ? <CreateCampaign /> : <Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/dashboard" element={auth.user ? (auth.user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />) : <Login setAuth={setAuth} />} />
          <Route path="/apply" element={auth.user ? <ApplyCampaign /> : <Login setAuth={setAuth} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
