import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    // Mock fetch for dashboard info
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const res = await api.get(`/faculty/${user.email}`);
      if (res.data) setFacultyData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const currentLoad = facultyData?.currentLoad || 0;
  const maxLoad = facultyData?.maxLoad || 5;

  const stats = [
    { title: 'Current Load', value: `${currentLoad} / ${maxLoad}`, icon: Users, color: 'var(--primary)' },
    { title: 'Pending Requests', value: '3', icon: Clock, color: 'var(--warning)' }, // Mocked
    { title: 'Completed Projects', value: '12', icon: CheckCircle, color: 'var(--success)' },
  ];

  const workloadData = [
    { name: 'Your Load', value: currentLoad },
    { name: 'Capacity', value: maxLoad - currentLoad },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Faculty Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: `${stat.color}20`, borderRadius: 'var(--radius-lg)', color: stat.color }}>
              <stat.icon size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.title}</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{stat.value}</h2>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ marginBottom: '1.5rem' }}>Workload Capacity</h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={workloadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
              <Tooltip cursor={{fill: 'var(--bg-tertiary)'}} />
              <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
