import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Layers } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  // Mock data since we don't have dedicated analytics APIs yet
  const stats = [
    { title: 'Total Students', value: '156', icon: Users, color: 'var(--primary)' },
    { title: 'Registered Faculty', value: '24', icon: BookOpen, color: 'var(--accent)' },
    { title: 'Total Groups', value: '52', icon: Layers, color: 'var(--warning)' },
  ];

  const facultyLoadData = [
    { name: 'Dr. Smith', load: 4, maxLoad: 5 },
    { name: 'Dr. Johnson', load: 5, maxLoad: 5 },
    { name: 'Dr. Williams', load: 2, maxLoad: 4 },
    { name: 'Dr. Davis', load: 3, maxLoad: 6 },
  ];

  const groupStatusData = [
    { name: 'Assigned', value: 35 },
    { name: 'Pending Request', value: 12 },
    { name: 'Unassigned', value: 5 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Admin Dashboard</h1>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Faculty Workload Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyLoadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                />
                <Legend />
                <Bar dataKey="load" name="Current Load" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maxLoad" name="Max Capacity" fill="var(--bg-tertiary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Project Group Status</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={groupStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {groupStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
