import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectIdea, setProjectIdea] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get(`/students/${user.id}/status`).catch(() => null);
      if (res && res.data) {
        setStatus(res.data);
      } else {
        setStatus({ selectionStatus: 'PENDING', status: 'You need to register your idea.' });
      }

      const studentRes = await api.get(`/students/email/${user.email}`).catch(() => null);
      if (studentRes && studentRes.data) {
        setProjectTitle(studentRes.data.projectTitle || '');
        setProjectIdea(studentRes.data.projectIdea || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    try {
      // In a real flow, you'd register the student first or update their idea
      await api.post('/students', {
        id: user.id,
        name: user.name,
        email: user.email,
        projectTitle,
        projectIdea,
        selectionStatus: 'PENDING'
      });
      toast.success('Project idea submitted successfully!');
      fetchStatus();
    } catch (error) {
      toast.error('Failed to submit idea');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Student Dashboard</h1>

      {status && status.assignedFaculty && (
        <Card style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success-text)' }}>
            <CheckCircle size={32} />
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>Project Approved!</h3>
              <p>Your mentor is <strong>{status.assignedFaculty.name}</strong>.</p>
            </div>
          </div>
        </Card>
      )}

      {status && status.requestedFaculty && !status.assignedFaculty && (
        <Card style={{ backgroundColor: 'var(--warning-bg)', borderColor: 'var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--warning-text)' }}>
            <Clock size={32} />
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>Request Pending</h3>
              <p>You have requested <strong>{status.requestedFaculty.name}</strong> as your mentor. Waiting for approval.</p>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>Submit Project Idea</h2>
          <form onSubmit={handleSubmitIdea} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Project Title" 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="E.g., AI-based Allocation System"
              required
            />
            <div className="wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Project Abstract / Idea</label>
              <textarea 
                rows={5}
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                style={{
                  width: '100%', padding: '0.625rem 0.875rem', border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', outline: 'none'
                }}
                required
              />
            </div>
            <Button type="submit">Submit Idea</Button>
          </form>
        </Card>

        <Card>
          <h2 style={{ marginBottom: '1rem' }}>Next Steps</h2>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Submit your project idea and abstract.</li>
            <li>Go to the Recommendations tab to get AI-suggested faculty members.</li>
            <li>Send a request to your preferred faculty.</li>
            <li>Wait for the faculty to approve or reject your request.</li>
            <li>If the deadline passes, you will be automatically clustered and assigned a mentor.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
