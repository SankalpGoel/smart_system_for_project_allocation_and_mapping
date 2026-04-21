import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/Table';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Check, X } from 'lucide-react';

const FacultyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/faculty-requests/${user.id}/pending`);
      setRequests(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load requests');
    }
  };

  const handleAction = async (studentId, action) => {
    try {
      await api.post(`/faculty-requests/${user.id}/${action}/${studentId}`);
      toast.success(`Request ${action}ed successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Incoming Student Requests</h1>
      
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>Student Name</TH>
              <TH>Email</TH>
              <TH>Project Title</TH>
              <TH>Abstract / Idea</TH>
              <TH style={{ textAlign: 'right' }}>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {requests.length > 0 ? requests.map((req) => (
              <TR key={req.studentId}>
                <TD><strong>{req.studentName}</strong></TD>
                <TD>{req.studentEmail}</TD>
                <TD>{req.projectTitle}</TD>
                <TD style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {req.projectIdea}
                </TD>
                <TD style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Button variant="primary" onClick={() => handleAction(req.studentId, 'approve')} style={{ padding: '0.5rem' }}>
                      <Check size={16} /> Approve
                    </Button>
                    <Button variant="danger" onClick={() => handleAction(req.studentId, 'reject')} style={{ padding: '0.5rem' }}>
                      <X size={16} /> Reject
                    </Button>
                  </div>
                </TD>
              </TR>
            )) : (
              <TR>
                <TD colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No pending requests at this time.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default FacultyRequests;
