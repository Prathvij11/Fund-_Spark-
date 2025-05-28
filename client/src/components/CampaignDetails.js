import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donation, setDonation] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateError, setDonateError] = useState(null);
  const [donateSuccess, setDonateSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonationAmount, setLastDonationAmount] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchCampaign = () => {
    setLoading(true);
    fetch(`/api/campaigns/${id}`)
      .then(res => res.json())
      .then(data => {
        setCampaign(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch campaign');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonateLoading(true);
    setDonateError(null);
    setDonateSuccess(null);
    setShowSuccessModal(false);

    if (!donation || isNaN(Number(donation)) || Number(donation) <= 0) {
      setDonateError('Enter a valid amount');
      setDonateLoading(false);
      return;
    }

    if (!user || !token) {
      setDonateError('Please login to make a donation');
      setDonateLoading(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setDonateError('Failed to load payment gateway');
      setDonateLoading(false);
      return;
    }

    const options = {
      key: 'rzp_test_2JRErRmQyZcaDz',
      amount: Math.round(Number(donation) * 100),
      currency: 'INR',
      name: 'FundSpark',
      description: `Donation to ${campaign.title}`,
      handler: async function (response) {
        try {
          const res = await fetch(`/api/campaigns/${id}/donate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              amount: Number(donation),
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.message || 'Failed to record donation');
          }
          
          // Store the donation amount for the success modal
          setLastDonationAmount(Number(donation));
          
          // Update campaign data
          await fetchCampaign();
          
          // Show success message
          setDonateSuccess('Donation recorded successfully!');
          setShowSuccessModal(true);
          setDonation('');
          
          // Hide success modal after 5 seconds
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 5000);
        } catch (err) {
          console.error('Donation error:', err);
          setDonateError(err.message || 'Failed to record donation. Please try again.');
        } finally {
          setDonateLoading(false);
        }
      },
      prefill: {
        name: user?.username || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      theme: {
        color: '#1976d2'
      },
      modal: {
        ondismiss: function () {
          setDonateLoading(false);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleDelete = async () => {
    setDeleteError(null);
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete campaign');
      navigate('/campaigns');
    } catch (err) {
      setDeleteError('Failed to delete campaign');
    }
  };

  const getProgress = (raised, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  if (loading) return <div>Loading campaign...</div>;
  if (error) return <div>{error}</div>;
  if (!campaign) return <div>Campaign not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '2rem',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            width: 80,
            height: 80,
            background: '#e8f5e9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <svg style={{ width: 40, height: 40, color: '#2e7d32' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <h2 style={{ 
            fontSize: '1.5rem',
            color: '#2e7d32',
            marginBottom: '1rem'
          }}>Payment Successful!</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#333',
            marginBottom: '1rem'
          }}>
            Thank you for your donation of ₹{lastDonationAmount}
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#666'
          }}>
            Your contribution will help make a difference.
          </p>
        </div>
      )}

      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        padding: '2rem', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {campaign.image && (
          <div style={{
            position: 'relative',
            width: '50%',
            margin: '2rem auto',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <img 
              src={`/uploads/${campaign.image}`} 
              alt={campaign.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
              onClick={() => {
                const img = new Image();
                img.src = `/uploads/${campaign.image}`;
                const w = window.open('');
                w.document.write(img.outerHTML);
                w.document.title = campaign.title;
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              color: 'white',
              fontSize: '0.9rem',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
            >
              Click to view full size
            </div>
          </div>
        )}
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          color: '#1976d2'
        }}>{campaign.title}</h1>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6,
          color: '#333',
          marginBottom: '1.5rem'
        }}>{campaign.description}</p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            height: 10, 
            background: '#e3e8ee', 
            borderRadius: 6, 
            overflow: 'hidden',
            marginBottom: '0.5rem',
            position: 'relative'
          }}>
            <div style={{
              width: getProgress(campaign.amountRaised, campaign.goal) + '%',
              height: '50%',
              background: 'linear-gradient(90deg,#42a5f5 0%,#1976d2 100%)',
              borderRadius: 6,
              transition: 'width 0.8s ease-out',
              position: 'relative'
            }}>
              {showSuccessModal && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: -20,
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  animation: 'slideIn 0.5s ease-out'
                }}>
                  +₹{lastDonationAmount}
                </div>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            color: '#1976d2',
            fontWeight: 600
          }}>
            <span>{getProgress(campaign.amountRaised, campaign.goal)}%</span>
            <span>₹{campaign.amountRaised} / ₹{campaign.goal}</span>
          </div>
        </div>

        <div style={{ 
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: 8,
          border: '1px solid #e3e8ee'
        }}>
          <h2 style={{ 
            fontSize: '1.3rem',
            marginBottom: '1rem',
            color: '#1976d2'
          }}>Make a Donation</h2>
          
          <form onSubmit={handleDonate}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                value={donation}
                onChange={e => setDonation(e.target.value)}
                placeholder="Enter amount (₹)"
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '0.9rem 1.1rem',
                  borderRadius: 8,
                  border: '1.5px solid #cfd8dc',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
                onBlur={e => e.target.style.border = '1.5px solid #cfd8dc'}
              />
            </div>
            
            <button
              type="submit"
              disabled={donateLoading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: donateLoading ? 'not-allowed' : 'pointer',
                opacity: donateLoading ? 0.7 : 1,
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => !donateLoading && (e.target.style.background = 'linear-gradient(90deg,#1565c0 0%,#1976d2 100%)')}
              onMouseOut={e => !donateLoading && (e.target.style.background = 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)')}
            >
              {donateLoading ? 'Processing...' : 'Donate Now'}
            </button>
          </form>

          {donateError && (
            <div style={{
              marginTop: '1rem',
              padding: '0.8rem',
              background: '#ffebee',
              color: '#d32f2f',
              borderRadius: 6,
              fontSize: '0.95rem'
            }}>
              {donateError}
            </div>
          )}
          
          {donateSuccess && (
            <div style={{
              marginTop: '1rem',
              padding: '0.8rem',
              background: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: 6,
              fontSize: '0.95rem'
            }}>
              {donateSuccess}
            </div>
          )}
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={handleDelete}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
            onMouseOver={e => e.target.style.background = '#c62828'}
            onMouseOut={e => e.target.style.background = '#d32f2f'}
          >
            Delete Campaign
          </button>
        )}
        
        {deleteError && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            background: '#ffebee',
            color: '#d32f2f',
            borderRadius: 6,
            fontSize: '0.95rem'
          }}>
            {deleteError}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -48%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
          @keyframes slideIn {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default CampaignDetails; 