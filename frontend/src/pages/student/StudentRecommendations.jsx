import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Bot, Star } from 'lucide-react';

const StudentRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/students/${user.id}/get-recommendations`);
      if (res.data.recommendations) {
        setRecommendations(res.data.recommendations);
        toast.success('AI Generated recommendations successfully!');
      } else if (res.data.message) {
        toast(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch recommendations. Ensure project idea is submitted.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFaculty = async (facultyEmail) => {
    try {
      // Find faculty ID by email (mocking this flow slightly)
      const facRes = await api.get(`/faculty/${facultyEmail}`);
      if (facRes.data && facRes.data.id) {
        await api.post(`/students/${user.id}/select-faculty/${facRes.data.id}`);
        toast.success(`Request sent to ${facRes.data.name}!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>AI Recommendations</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Get ML-powered faculty suggestions based on your project abstract using Sentence-BERT.</p>
        </div>
        <Button onClick={fetchRecommendations} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} />
          {loading ? 'Analyzing...' : 'Generate Recommendations'}
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.length > 0 ? recommendations.map((rec, index) => (
          <Card key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', 
                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold'
              }}>
                #{index + 1}
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem' }}>{rec.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{rec.domain_expertise}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--warning)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Star size={16} fill="var(--warning)" />
                  Similarity Score: {(rec.similarity_score * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <Button onClick={() => handleSelectFaculty(rec.email)}>
              Send Request
            </Button>
          </Card>
        )) : (
          !loading && (
            <Card style={{ textAlign: 'center', padding: '3rem' }}>
              <Bot size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
              <h3>No Recommendations Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Click the button above to analyze your project idea and find the best mentors.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default StudentRecommendations;
