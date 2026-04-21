import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminSettings = () => {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('Fall');
  const [deadline, setDeadline] = useState('');
  const [currentDeadline, setCurrentDeadline] = useState(null);

  useEffect(() => {
    fetchCurrentDeadline();
  }, []);

  const fetchCurrentDeadline = async () => {
    try {
      const res = await api.get('/admin/current-deadline');
      if (res.data.found) {
        setCurrentDeadline(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDeadline = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/set-deadline', {
        academicYear,
        semester,
        deadline
      });
      toast.success('Deadline set successfully');
      fetchCurrentDeadline();
    } catch (error) {
      toast.error('Failed to set deadline');
    }
  };

  const handleTriggerClustering = async () => {
    try {
      toast.loading('Triggering ML Clustering...', { id: 'cluster' });
      await api.post('/admin/trigger-clustering');
      toast.success('Clustering triggered successfully', { id: 'cluster' });
    } catch (error) {
      toast.error('Failed to trigger clustering', { id: 'cluster' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>System Settings</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>Selection Deadline</h2>
          {currentDeadline && currentDeadline.deadline && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <p><strong>Current Active Deadline:</strong> {new Date(currentDeadline.deadline).toLocaleString()}</p>
              <p>Status: {currentDeadline.isDeadlinePassed ? <span style={{color: 'var(--danger)'}}>Passed</span> : <span style={{color: 'var(--success)'}}>Active</span>}</p>
            </div>
          )}
          
          <form onSubmit={handleSetDeadline} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Academic Year" 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
            <Input 
              label="Semester" 
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />
            <Input 
              label="Deadline" 
              type="datetime-local" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <Button type="submit">Update Deadline</Button>
          </form>
        </Card>

        <Card>
          <h2 style={{ marginBottom: '1rem' }}>ML Operations</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Manually trigger the AI grouping and clustering algorithm. This will group students based on semantic similarity of their project abstracts using Sentence-BERT.
          </p>
          <Button onClick={handleTriggerClustering} variant="primary" style={{ width: '100%' }}>
            Trigger Clustering Process
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
