import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentUpload = () => {
  const handleUpload = (e) => {
    e.preventDefault();
    toast.success('Report uploaded successfully! (Mock)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Upload Project Report</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Upload your final project report for AI summarization and faculty review.</p>
      
      <Card style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <UploadCloud size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Drag & Drop your report</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Supports PDF, DOCX (Max 10MB)</p>
          
          <input type="file" id="report" style={{ display: 'none' }} />
          <label htmlFor="report" style={{ 
            padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', 
            borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-light)'}
          >
            Browse Files
          </label>

          <Button type="submit" variant="primary" style={{ marginTop: '2rem', width: '100%' }}>
            Upload Report
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentUpload;
