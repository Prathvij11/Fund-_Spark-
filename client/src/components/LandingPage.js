import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch campaigns');
        setLoading(false);
      });
  }, []);

  // Helper for progress percent
  const getProgress = (raised, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: 'linear-gradient(90deg, #f8fafc 0%, #e3e8ee 100%)',
        borderRadius: 18,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: '2.5rem 2rem 2rem 2rem',
        marginBottom: '2.5rem',
        border: '1px solid #e3e8ee',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1976d2', marginBottom: '1.2rem', letterSpacing: 1 }}>About Fundspark</h1>
        <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Fundspark is a next-generation crowdfunding platform designed to spark change, support innovation, and empower dreams. Whether you're an individual with a vision, a nonprofit on a mission, or a community in need, Fundspark provides a seamless way to raise funds and connect with supporters who care.
        </p>
        <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Our platform makes it simple to launch campaigns, share compelling stories, and collect donations securely. With powerful tools and a user-friendly interface, we help you focus on what truly matters—making an impact.
        </p>
        <div style={{
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          borderRadius: 12,
          padding: '1.5rem 1.2rem',
          margin: '2rem 0',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.7rem', letterSpacing: 0.5 }}>Why Fundspark Exists</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>
            At Fundspark, we believe that every idea, cause, or dream deserves a chance to shine. Too often, financial limitations hold people back from creating something meaningful. We created Fundspark to change that—to give anyone, anywhere, the opportunity to ignite support and fuel their journey.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, margin: 0, marginTop: '1rem' }}>
            From life-changing causes to passion projects, Fundspark is here to turn ambition into action, and support into success.
          </p>
        </div>
        <Link to="/register">
          <button style={{ fontSize: '1.2rem', padding: '0.5rem 2rem', margin: '1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #e3e8ee', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#0d47a1'} onMouseOut={e => e.target.style.background = '#1976d2'}>
            Get Started
          </button>
        </Link>
      </div>
      <div style={{ marginTop: '3rem', textAlign: 'left', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>Currently Open Campaigns</h2>
        {loading ? <div>Loading campaigns...</div> : error ? <div>{error}</div> : (
          campaigns.length === 0 ? <p>No campaigns available.</p> : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2.2rem',
              justifyContent: 'center',
              marginTop: 16
            }}>
              {campaigns.map(campaign => (
                <div
                  key={campaign._id}
                  style={{
                    border: 'none',
                    borderRadius: 18,
                    background: '#fff',
                    boxShadow: '0 6px 32px rgba(25, 118, 210, 0.10)',
                    width: 320,
                    padding: 0,
                    position: 'relative',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.025)';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(25, 118, 210, 0.18)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 6px 32px rgba(25, 118, 210, 0.10)';
                  }}
                >
                  <div style={{height:8, background:'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)'}}></div>
                  {/* Avatar */}
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    left: 18,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1976d2 60%,#42a5f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    boxShadow: '0 2px 8px #e3e8ee',
                    zIndex: 2
                  }}>
                    {campaign.title?.[0]?.toUpperCase() || '?'}
                  </div>
                  {campaign.image && (
                    <div style={{ textAlign: 'center', margin: '18px 0 10px 0' }}>
                      <img src={`/uploads/${campaign.image}`} alt="Campaign" style={{ maxWidth: 240, maxHeight: 120, borderRadius: 12, boxShadow: '0 2px 8px #e3e8ee' }} />
                    </div>
                  )}
                  {/* Progress bar */}
                  <div style={{margin:'0 1.5rem 18px 1.5rem'}}>
                    <div style={{height:10, background:'#e3e8ee', borderRadius:6, overflow:'hidden', position:'relative'}}>
                      <div style={{
                        width: getProgress(campaign.amountRaised, campaign.goal) + '%',
                        height: '100%',
                        background: 'linear-gradient(90deg,#42a5f5 0%,#1976d2 100%)',
                        borderRadius:6,
                        transition:'width 0.4s',
                      }}></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.98em',marginTop:2,color:'#1976d2',fontWeight:600}}>
                      <span>{getProgress(campaign.amountRaised, campaign.goal)}%</span>
                      <span>₹{campaign.amountRaised} / ₹{campaign.goal}</span>
                    </div>
                  </div>
                  <div style={{padding:'0 1.5rem 1.5rem 1.5rem'}}>
                    <h3 style={{fontWeight:800, fontSize:'1.25rem', color:'#1976d2', margin:'10px 0 8px 0', letterSpacing:0.5}}>{campaign.title}</h3>
                    <p style={{color:'#444', fontSize:'1.05rem', marginBottom:10, minHeight:48}}>{campaign.description}</p>
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      style={{
                        display:'block',
                        width:'100%',
                        fontWeight:700,
                        fontSize:'1.08rem',
                        color:'#fff',
                        background:'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)',
                        borderRadius: 10,
                        padding: '0.7rem 0',
                        boxShadow: '0 1px 4px #e3e8ee',
                        letterSpacing: 0.5,
                        border: 'none',
                        textDecoration: 'none',
                        textAlign: 'center',
                        marginTop: 8,
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={e => e.target.style.background = '#1976d2'}
                      onMouseOut={e => e.target.style.background = 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)'}
                    >View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LandingPage; 