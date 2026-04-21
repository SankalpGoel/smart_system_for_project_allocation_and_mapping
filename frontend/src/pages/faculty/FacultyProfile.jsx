import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Sparkles } from 'lucide-react';

const FacultyProfile = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState({
    name: '',
    email: '',
    orcid: '',
    scopus: '',
    domainExpertise: '',
    maxLoad: 5
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/faculty/${user.email}`);
      if (res.data) setFaculty(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/faculty', faculty);
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    toast.loading('Extracting domains using AI...', { id: 'scrape' });
    try {
      const res = await api.post('/faculty/scrape', faculty);
      if (res.data) {
        setFaculty(res.data);
        toast.success('Domains updated via ORCID/Scopus!', { id: 'scrape' });
      }
    } catch (error) {
      toast.error('Failed to extract domains. Ensure IDs are correct.', { id: 'scrape' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Profile Settings</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1.5rem' }}>Personal Information</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Full Name" 
              value={faculty.name}
              onChange={(e) => setFaculty({...faculty, name: e.target.value})}
              required
            />
            <Input 
              label="Email Address" 
              type="email"
              value={faculty.email}
              onChange={(e) => setFaculty({...faculty, email: e.target.value})}
              disabled
            />
            <Input 
              label="Max Student Capacity" 
              type="number"
              value={faculty.maxLoad}
              onChange={(e) => setFaculty({...faculty, maxLoad: e.target.value})}
            />
            <Button type="submit" style={{ marginTop: '1rem' }}>Save Profile</Button>
          </form>
        </Card>

        <Card>
          <h2 style={{ marginBottom: '1.5rem' }}>Research & AI Extraction</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Provide your ORCID or Scopus ID. Our AI will automatically extract your research domains and keywords to match you with students.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <Input 
              label="ORCID" 
              value={faculty.orcid || ''}
              onChange={(e) => setFaculty({...faculty, orcid: e.target.value})}
              placeholder="0000-0000-0000-0000"
            />
            <Input 
              label="Scopus Author ID" 
              value={faculty.scopus || ''}
              onChange={(e) => setFaculty({...faculty, scopus: e.target.value})}
              placeholder="e.g., 57200000000"
            />
          </div>
          
          <Button onClick={handleScrape} disabled={loading} variant="secondary" style={{ width: '100%', marginBottom: '1.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            {loading ? 'Extracting...' : 'Auto-Extract Domains using Gemini'}
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Extracted Domain Expertise</label>
            <textarea 
              rows={4}
              value={faculty.domainExpertise || ''}
              onChange={(e) => setFaculty({...faculty, domainExpertise: e.target.value})}
              style={{
                width: '100%', padding: '0.625rem 0.875rem', border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', outline: 'none'
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyProfile;
