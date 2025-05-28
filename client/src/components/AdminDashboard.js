import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Helper for progress percent
const getProgress = (raised, goal) => {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};

// Helper for days left (assuming 30 days from createdAt)
const getDaysLeft = (createdAt) => {
  if (!createdAt) return null;
  const created = new Date(createdAt);
  const now = new Date();
  const diff = 30 - Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notes, setNotes] = useState({});
  const notesTimeout = useRef({});
  const navigate = useNavigate();
  // Filtering, sorting, and search state
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

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

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setApplications(data);
          // Load notes
          const notesObj = {};
          data.forEach(app => { notesObj[app._id] = app.adminNotes || ''; });
          setNotes(notesObj);
        });
    }
  }, [user, token]);

  const handleDelete = async (id) => {
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
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      setDeleteError('Failed to delete campaign');
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 style={{textAlign:'center',marginBottom:32,color:'#1976d2',fontWeight:800,letterSpacing:1}}>Admin Dashboard</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2.5rem',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 32
      }}>
        {/* All Campaigns Column */}
        <div style={{flex:'1 1 340px',minWidth:320,maxWidth:420}}>
          <h3 style={{color:'#1976d2',fontWeight:700,marginBottom:18}}>All Campaigns</h3>
          {campaigns.length === 0 ? <p>No campaigns found.</p> : (
            <ul style={{paddingLeft:0,listStyle:'none'}}>
              {campaigns.map(campaign => (
                <li key={campaign._id} style={{marginBottom: '1.1rem',background:'#f8fafc',borderRadius:10,padding:'0.8rem 1rem',boxShadow:'0 1px 4px #e3e8ee',display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontWeight:700,color:'#1976d2',fontSize:'1.08rem',flex:1}}>
                    <Link to={`/campaigns/${campaign._id}`} style={{color:'#1976d2',textDecoration:'none'}}>{campaign.title}</Link>
                  </span>
                  <button onClick={() => navigate(`/edit/${campaign._id}`)} style={{marginLeft: 4, fontSize:'0.98em',padding:'0.3rem 0.7rem',borderRadius:6,border:'none',background:'#e3e8ee',color:'#1976d2',fontWeight:700,cursor:'pointer'}}>Edit</button>
                  <button onClick={() => handleDelete(campaign._id)} style={{marginLeft: 4, fontSize:'0.98em',padding:'0.3rem 0.7rem',borderRadius:6,border:'none',background:'#d32f2f',color:'#fff',fontWeight:700,cursor:'pointer'}}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          {deleteError && <div style={{color:'red'}}>{deleteError}</div>}
        </div>
        {/* Pending Applications Column */}
        <div style={{flex:'2 1 520px',minWidth:340,maxWidth:900}}>
          <h3 style={{color:'#1976d2',fontWeight:700,marginBottom:18}}>Pending Campaign Applications</h3>
          {/* Controls for filtering, sorting, and search */}
          <div style={{display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',margin:'18px 0 10px 0',justifyContent:'center'}}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{padding:'0.5rem 1rem',borderRadius:8,border:'1.5px solid #cfd8dc',fontSize:'1.01em'}}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{padding:'0.5rem 1rem',borderRadius:8,border:'1.5px solid #cfd8dc',fontSize:'1.01em'}}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="goal-desc">Goal High-Low</option>
              <option value="goal-asc">Goal Low-High</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title or description..."
              style={{padding:'0.5rem 1rem',borderRadius:8,border:'1.5px solid #cfd8dc',fontSize:'1.01em',width:220}}
            />
          </div>
          {/* Filter, sort, and search applications */}
          {(() => {
            let filtered = applications;
            if (filterStatus !== 'all') filtered = filtered.filter(a => a.status === filterStatus);
            if (search.trim()) {
              const s = search.trim().toLowerCase();
              filtered = filtered.filter(a => a.title.toLowerCase().includes(s) || a.description.toLowerCase().includes(s));
            }
            if (sortBy === 'date-desc') filtered = filtered.slice().sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
            if (sortBy === 'date-asc') filtered = filtered.slice().sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
            if (sortBy === 'goal-desc') filtered = filtered.slice().sort((a,b) => b.goal-a.goal);
            if (sortBy === 'goal-asc') filtered = filtered.slice().sort((a,b) => a.goal-b.goal);
            return filtered.length === 0 ? <p>No applications found.</p> : (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '2.2rem', justifyContent: 'center', marginTop: 18
              }}>
                {filtered.map(app => (
                  <div key={app._id} style={{
                    border: 'none',
                    borderRadius: 18,
                    background: '#fff',
                    boxShadow: '0 6px 32px rgba(25, 118, 210, 0.10)',
                    width: 370,
                    padding: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 320
                  }}>
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
                    }}>{app.title?.[0]?.toUpperCase() || '?'}</div>
                    {app.image && (
                      <div style={{ textAlign: 'center', margin: '18px 0 10px 0' }}>
                        <img src={`/uploads/${app.image}`} alt="Application" style={{ maxWidth: 220, maxHeight: 110, borderRadius: 10, boxShadow: '0 2px 8px #e3e8ee' }} />
                      </div>
                    )}
                    <div style={{padding:'0 1.3rem 1.3rem 1.3rem', flex:1, display:'flex', flexDirection:'column'}}>
                      <h3 style={{fontWeight:800, fontSize:'1.18rem', color:'#1976d2', margin:'10px 0 8px 0', letterSpacing:0.5}}>{app.title}</h3>
                      <p style={{color:'#444', fontSize:'1.03rem', marginBottom:8, minHeight:36}}>{app.description}</p>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                        <span style={{color:'#1976d2',fontWeight:700}}>Goal: ₹{app.goal}</span>
                        {/* Status tag */}
                        <span style={{
                          color: app.status === 'approved' ? '#388e3c' : app.status === 'rejected' ? '#d32f2f' : '#1976d2',
                          background: app.status === 'approved' ? '#e8f5e9' : app.status === 'rejected' ? '#ffebee' : '#e3e8ee',
                          borderRadius: 8,
                          padding: '2px 12px',
                          fontWeight: 700,
                          fontSize: '0.98em',
                          letterSpacing: 0.5,
                          border: '1px solid #e3e8ee',
                          marginRight: 6
                        }}>{app.status?.toUpperCase()}</span>
                        {/* Demo tag */}
                        <span style={{
                          color: '#fff',
                          background: '#1976d2',
                          borderRadius: 8,
                          padding: '2px 10px',
                          fontWeight: 700,
                          fontSize: '0.93em',
                          marginRight: 6
                        }}>DEMO</span>
                        {/* Days left tag */}
                        {getDaysLeft(app.createdAt) !== null && (
                          <span style={{
                            color: getDaysLeft(app.createdAt) <= 5 ? '#d32f2f' : '#1976d2',
                            background: '#e3e8ee',
                            borderRadius: 8,
                            padding: '2px 10px',
                            fontWeight: 700,
                            fontSize: '0.93em',
                          }}>{getDaysLeft(app.createdAt)} days left</span>
                        )}
                        {/* Goal reached badge */}
                        {app.amountRaised >= app.goal && (
                          <span style={{
                            color: '#fff',
                            background: '#388e3c',
                            borderRadius: 8,
                            padding: '2px 10px',
                            fontWeight: 700,
                            fontSize: '0.93em',
                            marginLeft: 6
                          }}>GOAL REACHED</span>
                        )}
                      </div>
                      <div style={{margin:'8px 0',fontSize:'0.98em',color:'#1976d2'}}>
                        <b>Payout Details:</b><br />
                        {app.payoutName && <>Name: {app.payoutName}<br /></>}
                        {app.payoutAccount && <>Account: {app.payoutAccount}<br /></>}
                        {app.payoutIFSC && <>IFSC: {app.payoutIFSC}<br /></>}
                        {app.payoutUPI && <>UPI: {app.payoutUPI}<br /></>}
                      </div>
                      <div style={{margin:'8px 0',fontSize:'0.98em',color:'#1976d2'}}>
                        Payment: <b>{app.paymentStatus || 'pending'}</b>
                        {app.paymentStatus === 'paid' && (
                          <>
                            <br />Amount Paid: ₹{app.amountPaid}<br />
                            Payment ID: <span style={{fontSize:'0.95em',color:'#1976d2'}}>{app.paymentId}</span>
                          </>
                        )}
                      </div>
                      <div style={{display:'flex',gap:12,marginTop:'auto'}}>
                        <button onClick={async () => {
                          await fetch(`/api/applications/${app._id}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                          setApplications(applications.filter(a => a._id !== app._id));
                        }} style={{
                          flex:1,
                          fontWeight:700,
                          fontSize:'1.08rem',
                          color:'#fff',
                          background:'linear-gradient(90deg,#388e3c 0%,#43e97b 100%)',
                          borderRadius: 10,
                          padding: '0.7rem 0',
                          boxShadow: '0 1px 4px #e3e8ee',
                          border: 'none',
                          cursor:'pointer',
                          transition: 'background 0.2s',
                        }}
                          onMouseOver={e => e.target.style.background = '#388e3c'}
                          onMouseOut={e => e.target.style.background = 'linear-gradient(90deg,#388e3c 0%,#43e97b 100%)'}
                        >Approve</button>
                        <button onClick={async () => {
                          await fetch(`/api/applications/${app._id}/reject`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                          setApplications(applications.filter(a => a._id !== app._id));
                        }} style={{
                          flex:1,
                          fontWeight:700,
                          fontSize:'1.08rem',
                          color:'#fff',
                          background:'linear-gradient(90deg,#d32f2f 0%,#ff5252 100%)',
                          borderRadius: 10,
                          padding: '0.7rem 0',
                          boxShadow: '0 1px 4px #e3e8ee',
                          border: 'none',
                          cursor:'pointer',
                          transition: 'background 0.2s',
                        }}
                          onMouseOver={e => e.target.style.background = '#d32f2f'}
                          onMouseOut={e => e.target.style.background = 'linear-gradient(90deg,#d32f2f 0%,#ff5252 100%)'}
                        >Reject</button>
                      </div>
                      {/* Admin notes */}
                      <div style={{margin:'8px 0 0 0'}}>
                        <label style={{fontWeight:600, color:'#1976d2', fontSize:'1.01em'}}>Admin Notes:</label>
                        <textarea
                          value={notes[app._id] || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setNotes(n => ({...n, [app._id]: val}));
                            if (notesTimeout.current[app._id]) clearTimeout(notesTimeout.current[app._id]);
                            notesTimeout.current[app._id] = setTimeout(() => {
                              fetch(`/api/applications/${app._id}/notes`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ notes: val })
                              });
                            }, 600);
                          }}
                          placeholder="Add notes for this application..."
                          style={{
                            width:'100%',
                            minHeight:38,
                            borderRadius:8,
                            border:'1.5px solid #cfd8dc',
                            fontSize:'1.01em',
                            padding:'0.5rem 0.8rem',
                            marginTop:4,
                            marginBottom:0,
                            outline:'none',
                            background:'#f8fafc',
                            resize:'vertical',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 