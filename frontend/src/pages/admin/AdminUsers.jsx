import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/Table';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminUsers = () => {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [activeTab, setActiveTab] = useState('STUDENTS');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [studentsRes, facultyRes] = await Promise.all([
        api.get('/students'),
        api.get('/faculty')
      ]);
      setStudents(studentsRes.data || []);
      setFaculty(facultyRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    }
  };

  const handleLoadMockData = async () => {
    try {
      await api.post('/faculty/load-json');
      toast.success('Mock faculty loaded successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to load mock data');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>User Management</h1>
        <Button onClick={handleLoadMockData} variant="outline">
          Load Default Faculty Data
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button 
            style={{ 
              fontWeight: 600, 
              color: activeTab === 'STUDENTS' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'STUDENTS' ? '2px solid var(--primary)' : 'none',
              paddingBottom: '0.5rem'
            }}
            onClick={() => setActiveTab('STUDENTS')}
          >
            Students ({students.length})
          </button>
          <button 
            style={{ 
              fontWeight: 600, 
              color: activeTab === 'FACULTY' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'FACULTY' ? '2px solid var(--primary)' : 'none',
              paddingBottom: '0.5rem'
            }}
            onClick={() => setActiveTab('FACULTY')}
          >
            Faculty ({faculty.length})
          </button>
        </div>

        {activeTab === 'STUDENTS' && (
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Project Title</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {students.length > 0 ? students.map(s => (
                <TR key={s.id}>
                  <TD>{s.id}</TD>
                  <TD><strong>{s.name}</strong></TD>
                  <TD>{s.email}</TD>
                  <TD>{s.projectTitle || '-'}</TD>
                  <TD>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: s.selectionStatus === 'ASSIGNED' ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: s.selectionStatus === 'ASSIGNED' ? 'var(--success-text)' : 'var(--warning-text)'
                    }}>
                      {s.selectionStatus || 'PENDING'}
                    </span>
                  </TD>
                </TR>
              )) : (
                <TR><TD colSpan="5" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No students found</TD></TR>
              )}
            </TBody>
          </Table>
        )}

        {activeTab === 'FACULTY' && (
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Domain</TH>
                <TH>Load</TH>
              </TR>
            </THead>
            <TBody>
              {faculty.length > 0 ? faculty.map(f => (
                <TR key={f.id}>
                  <TD>{f.id}</TD>
                  <TD><strong>{f.name}</strong></TD>
                  <TD>{f.email}</TD>
                  <TD>{f.domainExpertise || '-'}</TD>
                  <TD>{f.currentLoad} / {f.maxLoad}</TD>
                </TR>
              )) : (
                <TR><TD colSpan="5" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No faculty found</TD></TR>
              )}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;
