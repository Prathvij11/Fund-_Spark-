import React, { useEffect, useState } from 'react';

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) return;
    fetch('/api/applications/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch your applications');
        setLoading(false);
      });
  }, [user, token]);

  if (!user) return null;
  if (loading) return <div>Loading your applications...</div>;
  if (error) return <div style={{color:'#d32f2f'}}>{error}</div>;
  if (applications.length === 0) return <div style={{color:'#888'}}>You have not applied for any campaigns yet.</div>;

  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
      {applications.map(app => (
        <li key={app._id} style={{ marginBottom: 18, border: '1px solid #e3e8ee', borderRadius: 10, padding: 12, background: '#fff' }}>
          {app.image && (
            <div style={{ marginBottom: 8, textAlign: 'center' }}>
              <img src={`/uploads/${app.image}`} alt="Application" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, boxShadow: '0 2px 8px #e3e8ee' }} />
            </div>
          )}
          <b>{app.title}</b><br />
          <span style={{ color: '#1976d2', fontWeight: 600 }}>{app.status}</span><br />
          <div style={{margin:'8px 0',fontSize:'0.98em',color:'#1976d2'}}>
            <b>Payout Details:</b><br />
            {app.payoutName && <>Name: {app.payoutName}<br /></>}
            {app.payoutAccount && <>Account: {app.payoutAccount}<br /></>}
            {app.payoutIFSC && <>IFSC: {app.payoutIFSC}<br /></>}
            {app.payoutUPI && <>UPI: {app.payoutUPI}<br /></>}
          </div>
          Payment: <b>{app.paymentStatus || 'pending'}</b>
          {app.paymentStatus === 'paid' && (
            <>
              <br />Amount Paid: ₹{app.amountPaid}<br />
              Payment ID: <span style={{fontSize:'0.95em',color:'#1976d2'}}>{app.paymentId}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserApplications; 