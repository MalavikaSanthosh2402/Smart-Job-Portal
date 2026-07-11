import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toastSuccess, toastError, toastWarning } from '../utils/toast';

function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchJobType, setSearchJobType] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    profileSummary: '',
    experienceYears: 0,
    resumeText: ''
  });
  const userId = localStorage.getItem('userId');
  const fullName = localStorage.getItem('fullName');

  useEffect(() => {
    loadJobs();
    loadApplications();
    loadSkills();
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadJobs = () => {
    axios.get('http://localhost:8080/api/jobs/all')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  const loadApplications = () => {
    axios.get(
      `http://localhost:8080/api/applications/jobseeker/${userId}`)
      .then(res => setApplications(res.data))
      .catch(err => console.log(err));
  };

  const loadSkills = () => {
    axios.get(
      `http://localhost:8080/api/jobseeker/${userId}/skills`)
      .then(res => setSkills(res.data))
      .catch(err => console.log(err));
  };

  const loadProfile = () => {
    axios.get(
      `http://localhost:8080/api/jobseeker/${userId}/profile`)
      .then(res => {
        setProfile({
          fullName: res.data.fullName || '',
          phoneNumber: res.data.phoneNumber || '',
          profileSummary: res.data.profileSummary || '',
          experienceYears: res.data.experienceYears || 0,
          resumeText: res.data.resumeText || ''
        });
      })
      .catch(err => console.log(err));
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/jobseeker/${userId}/profile`,
        {
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          profileSummary: profile.profileSummary,
          experienceYears: String(profile.experienceYears),
          resumeText: profile.resumeText
        }
      );
      localStorage.setItem('fullName', profile.fullName);
      toastSuccess('Profile updated successfully!');
    } catch (err) {
      toastError('Error updating profile!');
    }
  };

  const searchJobs = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8080/api/jobs/filter', {
          params: {
            title: searchTitle,
            location: searchLocation,
            jobType: searchJobType
          }
        }
      );
      setFilteredJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clearSearch = () => {
    setSearchTitle('');
    setSearchLocation('');
    setSearchJobType('');
    setFilteredJobs([]);
  };

  const displayedJobs = filteredJobs.length > 0 ||
    searchTitle || searchLocation || searchJobType
    ? filteredJobs : jobs;

  const applyForJob = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/applications/apply/${userId}/${jobId}`
      );
      toastSuccess('Applied successfully!');
      loadApplications();
    } catch (err) {
      toastWarning('You have already applied for this job!');
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) {
      toastWarning('Please enter a skill!');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/jobseeker/${userId}/skills?skill=${newSkill.toLowerCase().trim()}`
      );
      setSkills([...skills, newSkill.toLowerCase().trim()]);
      setNewSkill('');
    } catch (err) {
      toastError('Error adding skill!');
    }
  };

  const removeSkill = async (skill) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/jobseeker/${userId}/skills?skill=${skill}`
      );
      setSkills(skills.filter(s => s !== skill));
    } catch (err) {
      toastError('Error removing skill!');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const statusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'bg-success-subtle text-success-emphasis';
    if (status === 'REJECTED') return 'bg-danger-subtle text-danger-emphasis';
    if (status === 'REVIEWED') return 'bg-info-subtle text-info-emphasis';
    return 'bg-warning-subtle text-warning-emphasis';
  };

  const matchTone = (score) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const jobTypeAccent = (type) => {
    if (type === 'REMOTE') return '#16a34a';
    if (type === 'PART_TIME') return '#0ea5e9';
    return '#14b8a6';
  };

  const statusAccent = (status) => {
    if (status === 'ACCEPTED') return '#16a34a';
    if (status === 'REJECTED') return '#ef4444';
    if (status === 'REVIEWED') return '#0ea5e9';
    return '#f59e0b';
  };

  const initials = (fullName || 'U')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const firstName = fullName ? fullName.split(' ')[0] : 'there';

  return (
    <div className="min-vh-100 bg-light">
      <nav className="app-navbar navbar navbar-expand px-4 py-3">
        <span className="navbar-brand fw-bold mb-0">
          <i className="bi bi-briefcase-fill"></i>
          Smart Job Portal
        </span>
        <div className="ms-auto d-flex align-items-center gap-3">
          <div
            className="navbar-user-chip d-none d-sm-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('profile')}>
            <div className="avatar-circle avatar-circle-sm"
              style={{ background: '#f0fdfa', color: '#14b8a6' }}>
              {initials}
            </div>
            <span className="fw-semibold text-dark">{fullName}</span>
          </div>
          <button className="btn btn-outline-secondary btn-sm"
            onClick={logout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-hero px-4 pt-4 pb-5">
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-circle avatar-circle-lg">{initials}</div>
            <div>
              <h3 className="fw-bold mb-1">Welcome back, {firstName}!</h3>
              <p className="mb-0 opacity-75">
                Here's what's happening with your job search today.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-3 mb-4 stat-card-float">
          <div className="col-sm-4">
            <div className="card border-0 shadow-lg rounded-4 p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#f0fdfa', color: '#14b8a6' }}>
                <i className="bi bi-briefcase"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">{jobs.length}</div>
                <div className="text-secondary small">Jobs Available</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-lg rounded-4 p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#ecfdf5', color: '#16a34a' }}>
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">
                  {applications.length}
                </div>
                <div className="text-secondary small">My Applications</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-lg rounded-4 p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#fff7ed', color: '#f59e0b' }}>
                <i className="bi bi-stars"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">
                  {skills.length}
                </div>
                <div className="text-secondary small">Skills Listed</div>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-pills gap-2 mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'jobs'
                ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('jobs')}>
              <i className="bi bi-search me-1"></i>
              Browse Jobs
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'applications'
                ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('applications')}>
              <i className="bi bi-file-earmark-text me-1"></i>
              My Applications
              {applications.length > 0 && (
                <span className="badge bg-primary ms-2">
                  {applications.length}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'skills'
                ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('skills')}>
              <i className="bi bi-stars me-1"></i>
              My Skills
              {skills.length > 0 && (
                <span className="badge bg-primary ms-2">
                  {skills.length}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'profile'
                ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('profile')}>
              <i className="bi bi-person-circle me-1"></i>
              My Profile
            </button>
          </li>
        </ul>

        {/* Browse Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <h4 className="fw-bold text-dark mb-3">Available Jobs</h4>
            <div className="card shadow-sm border-0 p-3 mb-4">
              <div className="row g-2">
                <div className="col-md-4">
                  <div className="input-icon">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by job title..."
                      value={searchTitle}
                      onChange={e => setSearchTitle(e.target.value)}
                      onKeyPress={e =>
                        e.key === 'Enter' && searchJobs()}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-icon">
                    <i className="bi bi-geo-alt"></i>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by location..."
                      value={searchLocation}
                      onChange={e => setSearchLocation(e.target.value)}
                      onKeyPress={e =>
                        e.key === 'Enter' && searchJobs()}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={searchJobType}
                    onChange={e => setSearchJobType(e.target.value)}>
                    <option value="">All Job Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary w-100"
                    onClick={searchJobs}>
                    Search
                  </button>
                </div>
              </div>
              {(searchTitle || searchLocation || searchJobType) && (
                <div className="mt-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={clearSearch}>
                    <i className="bi bi-x-lg me-1"></i>
                    Clear Filters
                  </button>
                  <span className="text-secondary ms-2 small">
                    {displayedJobs.length} result(s) found
                  </span>
                </div>
              )}
            </div>

            {displayedJobs.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search fs-1 d-block mb-2 text-secondary opacity-50"></i>
                <p className="text-secondary">
                  No jobs found matching your search.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={clearSearch}>
                  Show All Jobs
                </button>
              </div>
            )}
            {displayedJobs.map(job => {
              const alreadyApplied = applications.some(
                app => app.jobListing.id === job.id
              );
              const accent = jobTypeAccent(job.jobType);
              const skills = job.requiredSkills || [];
              return (
                <div key={job.id}
                  className="card card-hover accent-card shadow-sm border-0 mb-3 p-0"
                  style={{ '--accent-color': accent, cursor: 'pointer' }}
                  onClick={() => setSelectedJob(job)}>
                  <div className="p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div className="d-flex align-items-start gap-3">
                        <div className="icon-tile flex-shrink-0"
                          style={{ background: `${accent}1a`, color: accent }}>
                          <i className="bi bi-building"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                          <div className="d-flex flex-wrap column-gap-3 row-gap-1 text-secondary small">
                            <span>
                              <i className="bi bi-geo-alt me-1"></i>{job.location}
                            </span>
                            <span>
                              <i className="bi bi-cash-coin me-1"></i>{job.salaryRange}
                            </span>
                            <span>
                              <i className="bi bi-briefcase me-1"></i>
                              {job.experienceRequired} yrs exp
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="badge rounded-pill bg-info-subtle text-info-emphasis text-nowrap">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-secondary mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
                      <div>
                        {skills.slice(0, 6).map(s => (
                          <span key={s}
                            className="badge rounded-pill bg-primary-subtle text-primary-emphasis me-1 mb-1">
                            {s}
                          </span>
                        ))}
                        {skills.length > 6 && (
                          <span className="text-secondary small">
                            +{skills.length - 6} more
                          </span>
                        )}
                      </div>
                      {alreadyApplied ? (
                        <button
                          className="btn btn-success btn-sm text-nowrap" disabled>
                          <i className="bi bi-check-circle me-1"></i>
                          Already Applied
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm px-3 text-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyForJob(job.id);
                          }}>
                          Apply Now
                          <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h4 className="fw-bold text-dark mb-3">My Applications</h4>
            {applications.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-text fs-1 d-block mb-2 text-secondary opacity-50"></i>
                <p className="text-secondary mb-3">No applications yet.</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setActiveTab('jobs')}>
                  Browse Jobs
                </button>
              </div>
            )}
            {applications.map(app => (
              <div key={app.id}
                className="card accent-card shadow-sm border-0 mb-3 p-3"
                style={{ '--accent-color': statusAccent(app.status) }}>
                <h5 className="fw-bold text-dark">
                  {app.jobListing.title}
                </h5>
                <p className="text-secondary mb-2 small">
                  <i className="bi bi-geo-alt me-1"></i>
                  {app.jobListing.location}
                </p>
                <div className="mb-2">
                  <strong className="small text-dark">Match Score: </strong>
                  <span className={`badge fs-6 bg-${matchTone(app.matchScore)}-subtle text-${matchTone(app.matchScore)}-emphasis`}>
                    {app.matchScore}%
                  </span>
                </div>
                <div className="progress mb-2"
                  style={{height: '8px'}}>
                  <div
                    className={`progress-bar bg-${matchTone(app.matchScore)}`}
                    style={{width: `${app.matchScore}%`}}>
                  </div>
                </div>
                <div className="mb-2">
                  <strong className="small text-dark">Matched Skills: </strong>
                  {app.matchedSkills &&
                    [...app.matchedSkills].map(s => (
                      <span key={s}
                        className="badge bg-success-subtle text-success-emphasis me-1">{s}</span>
                    ))}
                  {app.matchedSkills &&
                    app.matchedSkills.length === 0 && (
                    <span className="text-secondary small">None</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong className="small text-dark">Missing Skills: </strong>
                  {app.missingSkills &&
                    [...app.missingSkills].map(s => (
                      <span key={s}
                        className="badge bg-danger-subtle text-danger-emphasis me-1">{s}</span>
                    ))}
                  {app.missingSkills &&
                    [...app.missingSkills].length === 0 &&
                    app.matchScore > 0 && (
                    <span className="text-success small">
                      <i className="bi bi-check-circle me-1"></i>
                      All skills matched!
                    </span>
                  )}
                  {app.missingSkills &&
                    [...app.missingSkills].length === 0 &&
                    app.matchScore === 0 && (
                    <span className="text-secondary small">
                      No required skills listed
                    </span>
                  )}
                </div>
                <div>
                  <strong className="small text-dark">Status: </strong>
                  <span className={`badge ${statusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Skills Tab */}
        {activeTab === 'skills' && (
          <div>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h4 className="fw-bold text-dark mb-1">My Skills</h4>
                <p className="text-secondary mb-0 small">
                  Skills power your match score against job listings.
                </p>
              </div>
              <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fs-6 px-3 py-2">
                <i className="bi bi-stars me-1"></i>
                {skills.length} skill{skills.length !== 1 ? 's' : ''} added
              </span>
            </div>

            <div className="row g-3">
              <div className="col-lg-7">
                <div className="card shadow-sm border-0 p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="icon-tile"
                      style={{ background: '#f0fdfa', color: '#14b8a6' }}>
                      <i className="bi bi-tag"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Add a skill</h6>
                      <span className="text-secondary small">
                        Type a skill and hit enter, or click Add
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mb-4">
                    <div className="input-icon flex-grow-1">
                      <i className="bi bi-tag"></i>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. java, react, mysql"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyPress={e =>
                          e.key === 'Enter' && addSkill()}
                      />
                    </div>
                    <button
                      className="btn btn-primary px-4 text-nowrap"
                      onClick={addSkill}>
                      <i className="bi bi-plus-lg me-1"></i>
                      Add
                    </button>
                  </div>
                  {skills.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-stars fs-1 d-block mb-2 text-secondary opacity-50"></i>
                      <p className="text-secondary mb-0">No skills added yet.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <span
                          key={skill}
                          className="skill-chip badge rounded-pill bg-primary py-2 px-3">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card shadow-sm border-0 p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="icon-tile"
                      style={{ background: '#fff7ed', color: '#f59e0b' }}>
                      <i className="bi bi-lightbulb"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Suggested Skills</h6>
                      <span className="text-secondary small">
                        Click to add quickly
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {['java', 'spring', 'react', 'nodejs',
                      'mysql', 'python', 'docker', 'git',
                      'javascript', 'mongodb', 'aws', 'maven'
                    ].map(s => {
                      const alreadyAdded = skills.includes(s);
                      return (
                        <span
                          key={s}
                          className={`skill-chip skill-suggest-chip badge rounded-pill py-2 px-3 ${
                            alreadyAdded
                              ? 'skill-suggest-added bg-success-subtle text-success-emphasis'
                              : 'bg-secondary-subtle text-secondary-emphasis'
                          }`}
                          style={{ cursor: alreadyAdded ? 'default' : 'pointer' }}
                          onClick={() => {
                            if (!alreadyAdded) {
                              setNewSkill(s);
                            }
                          }}>
                          <i className={`bi ${alreadyAdded ? 'bi-check-lg' : 'bi-plus'}`}></i>
                          {s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h4 className="fw-bold text-dark mb-3">My Profile</h4>
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="avatar-circle avatar-circle-lg"
                  style={{ background: '#f0fdfa', color: '#14b8a6', border: 'none' }}>
                  {initials}
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-0">
                    {profile.fullName || fullName}
                  </h5>
                  <span className="text-secondary small">
                    {profile.experienceYears} yrs experience
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Full Name
                  </label>
                  <div className="input-icon">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.fullName}
                      onChange={e => setProfile({
                        ...profile, fullName: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>
                  <div className="input-icon">
                    <i className="bi bi-telephone"></i>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.phoneNumber}
                      onChange={e => setProfile({
                        ...profile, phoneNumber: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Experience (years)
                  </label>
                  <div className="input-icon">
                    <i className="bi bi-briefcase"></i>
                    <input
                      type="number"
                      className="form-control"
                      value={profile.experienceYears}
                      onChange={e => setProfile({
                        ...profile,
                        experienceYears: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Email
                  </label>
                  <div className="input-icon">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="text"
                      className="form-control"
                      value={localStorage.getItem('fullName') || ''}
                      disabled
                    />
                  </div>
                  <small className="text-secondary">
                    Email cannot be changed
                  </small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">
                    Profile Summary
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write a short summary about yourself..."
                    value={profile.profileSummary}
                    onChange={e => setProfile({
                      ...profile,
                      profileSummary: e.target.value
                    })}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">
                    Resume Text
                  </label>
                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Paste your resume content here. This helps improve your skill matching score..."
                    value={profile.resumeText}
                    onChange={e => setProfile({
                      ...profile, resumeText: e.target.value
                    })}
                  />
                  <small className="text-secondary">
                    <i className="bi bi-lightbulb me-1"></i>
                    Tip: Adding your resume text helps the AI
                    extract your skills automatically in future updates
                  </small>
                </div>
                <div className="col-12">
                  <button
                    className="btn btn-primary px-5"
                    onClick={updateProfile}>
                    <i className="bi bi-save me-1"></i>
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="modal-backdrop-custom" onClick={() => setSelectedJob(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="p-4 pb-0 d-flex justify-content-between align-items-start gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-tile flex-shrink-0"
                  style={{
                    background: `${jobTypeAccent(selectedJob.jobType)}1a`,
                    color: jobTypeAccent(selectedJob.jobType)
                  }}>
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-1">{selectedJob.title}</h4>
                  <span className="badge rounded-pill bg-info-subtle text-info-emphasis">
                    {selectedJob.jobType}
                  </span>
                </div>
              </div>
              <button type="button" className="btn-close flex-shrink-0"
                onClick={() => setSelectedJob(null)} aria-label="Close"></button>
            </div>

            <div className="p-4">
              <div className="d-flex flex-wrap column-gap-4 row-gap-2 text-secondary small mb-4 pb-3 border-bottom">
                <span>
                  <i className="bi bi-geo-alt me-1"></i>{selectedJob.location}
                </span>
                <span>
                  <i className="bi bi-cash-coin me-1"></i>{selectedJob.salaryRange}
                </span>
                <span>
                  <i className="bi bi-briefcase me-1"></i>
                  {selectedJob.experienceRequired} yrs exp
                </span>
              </div>

              <h6 className="fw-bold text-dark mb-2">Job Description</h6>
              <p className="text-secondary mb-4">
                {selectedJob.description || 'No description provided.'}
              </p>

              <h6 className="fw-bold text-dark mb-2">Required Skills</h6>
              <div className="mb-4">
                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 ? (
                  selectedJob.requiredSkills.map(s => (
                    <span key={s}
                      className="badge rounded-pill bg-primary-subtle text-primary-emphasis me-1 mb-1">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary small">
                    No specific skills listed
                  </span>
                )}
              </div>

              <div className="d-flex gap-2">
                {applications.some(app => app.jobListing.id === selectedJob.id) ? (
                  <button className="btn btn-success" disabled>
                    <i className="bi bi-check-circle me-1"></i>
                    Already Applied
                  </button>
                ) : (
                  <button className="btn btn-primary px-4"
                    onClick={() => {
                      applyForJob(selectedJob.id);
                      setSelectedJob(null);
                    }}>
                    Apply Now
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                )}
                <button className="btn btn-outline-secondary"
                  onClick={() => setSelectedJob(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobSeekerDashboard;
