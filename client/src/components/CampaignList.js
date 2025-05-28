import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CampaignList = () => {
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
      .catch(err => {
        setError('Failed to fetch campaigns');
        setLoading(false);
      });
  }, []);

  // Helper for progress percent
  const getProgress = (raised, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 style={{textAlign:'center',fontWeight:800,letterSpacing:1,marginBottom:32,color:'#1976d2'}}>Funding Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
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
      )}
    </div>
  );
};

export default CampaignList; 