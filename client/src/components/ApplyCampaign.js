import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('goal', goal);
      if (image) formData.append('image', image);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to submit application');
      setSuccess('Application submitted! Awaiting admin approval.');
      setTitle(''); setDescription(''); setGoal(''); setImage(null); setImagePreview(null);
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3e8ee 100%)',
      padding: '2rem 0'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 6px 32px rgba(25, 118, 210, 0.10)',
        padding: '2.5rem 2.2rem 2rem 2.2rem',
        maxWidth: 420,
        width: '100%',
        margin: '0 1rem',
        border: '1px solid #e3e8ee',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '2rem',
          color: '#1976d2',
          marginBottom: 18,
          letterSpacing: 1,
          borderBottom: '2px solid #e3e8ee',
          paddingBottom: 10
        }}>Apply for a New Campaign</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Campaign Title"
            style={{
              width: '100%',
              padding: '0.9rem 1.1rem',
              marginBottom: 18,
              borderRadius: 10,
              border: '1.5px solid #cfd8dc',
              fontSize: '1.08rem',
              outline: 'none',
              transition: 'border 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
            onBlur={e => e.target.style.border = '1.5px solid #cfd8dc'}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Describe your campaign..."
            rows={5}
            style={{
              width: '100%',
              padding: '0.9rem 1.1rem',
              marginBottom: 18,
              borderRadius: 10,
              border: '1.5px solid #cfd8dc',
              fontSize: '1.08rem',
              outline: 'none',
              resize: 'vertical',
              transition: 'border 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
            onBlur={e => e.target.style.border = '1.5px solid #cfd8dc'}
          />
          <input
            type="number"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            required
            min="1"
            placeholder="Goal Amount ($)"
            style={{
              width: '100%',
              padding: '0.9rem 1.1rem',
              marginBottom: 18,
              borderRadius: 10,
              border: '1.5px solid #cfd8dc',
              fontSize: '1.08rem',
              outline: 'none',
              transition: 'border 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
            onBlur={e => e.target.style.border = '1.5px solid #cfd8dc'}
          />
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="image-upload" style={{
              display: 'inline-block',
              width: '100%',
              padding: '0.85rem 0',
              background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)',
              color: '#1976d2',
              fontWeight: 700,
              fontSize: '1.08rem',
              borderRadius: 10,
              border: '1.5px solid #cfd8dc',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e3e8ee',
              transition: 'background 0.2s, color 0.2s',
              marginBottom: 6
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#e3e8ee'; e.currentTarget.style.color = '#0d47a1'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)'; e.currentTarget.style.color = '#1976d2'; }}
            >
              {image ? 'Change Image' : 'Upload Campaign Image'}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {image && (
              <div style={{ fontSize: '0.98rem', color: '#1976d2', marginBottom: 4, textAlign: 'center', wordBreak: 'break-all' }}>{image.name}</div>
            )}
            {imagePreview && (
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 10, boxShadow: '0 2px 8px #e3e8ee' }} />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.95rem',
              background: loading ? '#90caf9' : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: '1.13rem',
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px #e3e8ee',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 10,
              transition: 'background 0.2s',
            }}
            onMouseOver={e => { if (!loading) e.target.style.background = '#1976d2'; }}
            onMouseOut={e => { if (!loading) e.target.style.background = 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'; }}
          >
            {loading ? 'Submitting...' : 'Apply'}
          </button>
          {error && <div style={{color:'#d32f2f', background:'#fff3f3', border:'1px solid #ffcdd2', borderRadius:8, padding:'0.7rem 1rem', marginTop:10, fontWeight:600, textAlign:'center'}}>{error}</div>}
          {success && <div style={{color:'#388e3c', background:'#e8f5e9', border:'1px solid #a5d6a7', borderRadius:8, padding:'0.7rem 1rem', marginTop:10, fontWeight:600, textAlign:'center'}}>{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default ApplyCampaign; 