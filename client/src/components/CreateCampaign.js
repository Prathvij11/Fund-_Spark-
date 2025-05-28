import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, goal: Number(goal) })
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      setLoading(false);
      navigate('/campaigns');
    } catch (err) {
      setError('Failed to create campaign');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Goal Amount ($):</label><br />
          <input type="number" value={goal} onChange={e => setGoal(e.target.value)} required min="1" />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Campaign'}</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
};

export default CreateCampaign; 