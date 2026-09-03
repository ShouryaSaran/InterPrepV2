import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, UploadCloud, FileText, CheckCircle2, X, AlertCircle, Loader2 } from 'lucide-react';
import { uploadResume, getCurrentResume } from '../../services/resumeService';
import { generateAnalysis } from '../../services/analysisService';

const ResumeAnalyzer = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [currentResume, setCurrentResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Fetch current resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getCurrentResume();
        if (data.resume) {
          setCurrentResume(data.resume);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };
    fetchResume();
  }, []);

  const validateFile = (file) => {
    setError(null);
    setSuccess(false);
    
    if (!file) return false;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return false;
    }

    // Type limit
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are supported.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      e.target.value = null; // reset input
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await uploadResume(selectedFile);
      setSuccess(true);
      setCurrentResume(data.resume);
      setSelectedFile(null); // Clear selected to show the current resume state
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem' }}>
        <Sparkles size={18} />
        Resume × Role Analyzer
      </div>
      
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        How ready are you for your target role?
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Upload your resume and compare it against a job description<br/>
        to uncover skill gaps, strengths, and the areas that matter most.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Upload Resume Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--border-light)', fontSize: '0.75rem' }}>1</span>
            Upload Resume
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
          />

          {!currentResume && !selectedFile && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '1px dashed var(--border-light)',
                borderRadius: '8px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg)',
                minHeight: '180px',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <UploadCloud size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Drag & drop your resume here
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                PDF or DOCX • Max 5 MB
              </p>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}>
                Choose File
              </button>
            </div>
          )}

          {/* Selected File (Not Uploaded Yet) */}
          {selectedFile && !isUploading && !success && (
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} color="var(--text-secondary)" />
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                      {formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop().toUpperCase()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = null; }} 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>
              <button 
                onClick={handleUpload}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Upload Resume
              </button>
            </div>
          )}

          {/* Uploading State */}
          {isUploading && (
            <div style={{
              padding: '2rem',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px'
            }}>
              <Loader2 size={32} color="var(--text-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                Uploading and analyzing resume...
              </p>
            </div>
          )}

          {/* Current Resume / Success State */}
          {(currentResume || success) && !isUploading && !selectedFile && (
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(22, 101, 52, 0.05)',
              border: '1px solid #166534',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} color="#22c55e" />
                  <div>
                    <p style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 500 }}>
                      {success ? "Resume uploaded successfully" : "Current Resume"}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Using {currentResume.filename}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Replace Resume
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.75rem', color: '#f87171', fontSize: '0.75rem', backgroundColor: 'rgba(153, 27, 27, 0.1)', padding: '0.75rem', borderRadius: '6px' }}>
              <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
              <p>{error}</p>
            </div>
          )}

        </div>

        {/* Job Description Section */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--border-light)', fontSize: '0.75rem' }}>2</span>
            Role Details
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Job Title *" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Company (Optional)" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ position: 'relative', flex: 1 }}>
            <textarea
              placeholder="Paste the job description here... *"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '180px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1rem',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              {jobDescription.length}/5000
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={async () => {
            if (!currentResume || jobTitle.trim().length === 0 || jobDescription.length < 50 || isAnalyzing) return;
            setIsAnalyzing(true);
            setError(null);
            try {
              const analysis = await generateAnalysis(currentResume.id, jobTitle, company, jobDescription);
              navigate(`/${userid}/analysis/${analysis.id}`);
            } catch (err) {
              setError(err.message);
              setIsAnalyzing(false);
            }
          }}
          disabled={!currentResume || jobTitle.trim().length === 0 || jobDescription.length < 50 || isAnalyzing}
          style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--bg)',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: (currentResume && jobTitle.trim().length > 0 && jobDescription.length > 50 && !isAnalyzing) ? 1 : 0.5,
          cursor: (currentResume && jobTitle.trim().length > 0 && jobDescription.length > 50 && !isAnalyzing) ? 'pointer' : 'not-allowed'
        }}>
          {isAnalyzing ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          {isAnalyzing ? "Analyzing..." : "Analyze Match →"}
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
