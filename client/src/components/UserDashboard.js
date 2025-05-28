import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserApplications from './UserApplications';

const UserDashboard = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState(null);

  useEffect(() => {
    fetch('/api/auth/donations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setDonations(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch donations');
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (!onClose) {
      setCampaignsLoading(true);
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          setCampaigns(data);
          setCampaignsLoading(false);
        })
        .catch(() => {
          setCampaignsError('Failed to fetch campaigns');
          setCampaignsLoading(false);
        });
    }
  }, [onClose]);

  // If onClose is not provided, render full-page open campaigns
  if (!onClose) {
    return (
      <div style={{ textAlign: 'left', maxWidth: 800, margin: '2.5rem auto 0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Currently Open Campaigns</h2>
        {campaignsLoading ? <div>Loading campaigns...</div> : campaignsError ? <div>{campaignsError}</div> : (
          campaigns.length === 0 ? <p>No campaigns available.</p> : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
              {campaigns.map(campaign => (
                <div key={campaign._id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 280, boxShadow: '2px 2px 8px #eee' }}>
                  <h3>{campaign.title}</h3>
                  <p>{campaign.description}</p>
                  <p>Goal: ${campaign.goal}</p>
                  <p>Raised: ${campaign.amountRaised}</p>
                  <Link to={`/campaigns/${campaign._id}`}>View Details</Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  // If onClose is not provided, render nothing (prevents full-page mode)
  if (!onClose) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: 32,
      transform: 'translateY(-50%)',
      height: '80vh',
      width: 350,
      background: 'white',
      borderRadius: '18px 18px 18px 0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
      border: '1px solid #e3e8ee',
      zIndex: 1200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        borderRadius: '18px 0 0 0',
        padding: '1.5rem 1.2rem 1rem 1.2rem',
        fontWeight: 700,
        fontSize: '1.4rem',
        letterSpacing: 0.5,
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        position: 'relative',
      }}>
        {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 12,
          right: 16,
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          lineHeight: 1,
        }} aria-label="Close Dashboard">×</button>
      </div>
      <div style={{ padding: '1.2rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1976d2', marginBottom: 4 }}>Welcome, {user.username}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333', marginBottom: 8 }}>Your Donations</div>
          {loading ? <div>Loading donations...</div> : error ? <div style={{color:'#d32f2f'}}>{error}</div> : (
            donations.length === 0 ? <p style={{color:'#888'}}>You have not donated to any campaigns yet.</p> : (
              <ul style={{ paddingLeft: 18, margin: 0, maxHeight: 200, overflowY: 'auto' }}>
                {donations.map(donation => (
                  <li key={donation._id} style={{ marginBottom: 8, fontSize: '1rem', color: '#333' }}>
                    <b>{donation.campaign?.title || 'Deleted Campaign'}</b> — ${donation.amount} <span style={{color:'#888', fontSize:'0.95em'}}>on {new Date(donation.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333', marginBottom: 8 }}>Your Campaign Applications</div>
          <UserApplications />
        </div>
      </div>
      <div style={{ padding: '1.2rem', borderTop: '1px solid #e3e8ee', background: '#f8fafc' }}>
        {user.role === 'admin' && (
          <Link
            to="/dashboard"
            style={{
              display: 'block',
              width: '100%',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1976d2',
              background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)',
              borderRadius: 20,
              padding: '0.7rem 0',
              boxShadow: '0 1px 4px #e3e8ee',
              letterSpacing: 0.5,
              border: '1px solid #e3e8ee',
              textDecoration: 'none',
              marginBottom: 12,
              textAlign: 'center',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.target.style.background = '#e3e8ee'}
            onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)'}
          >Requests</Link>
        )}
        <button
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '0.7rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #e3e8ee',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.target.style.background = '#0d47a1'}
          onMouseOut={e => e.target.style.background = '#1976d2'}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard; 