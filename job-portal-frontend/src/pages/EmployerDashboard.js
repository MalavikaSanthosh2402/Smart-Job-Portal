import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toastSuccess, toastError, toastWarning } from '../utils/toast';

function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [showApplications, setShowApplications] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [editingJob, setEditingJob] = useState(null);
  const [editSkillInput, setEditSkillInput] = useState('');
  const [jobForm, setJobForm] = useState({
    title: '', description: '', location: '',
    salaryRange: '', jobType: 'FULL_TIME',
    experienceRequired: 0, requiredSkills: []
  });
  const userId = localStorage.getItem('userId');
  const fullName = localStorage.getItem('fullName');

  useEffect(() => {
    loadJobs();
  }, [userId]);

  const loadJobs = () => {
    axios.get(`http://localhost:8080/api/jobs/employer/${userId}`)
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  const handleChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setJobForm({
        ...jobForm,
        requiredSkills: [...jobForm.requiredSkills,
          skillInput.trim().toLowerCase()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setJobForm({
      ...jobForm,
      requiredSkills: jobForm.requiredSkills.filter(s => s !== skill)
    });
  };

  const addEditSkill = () => {
    if (editSkillInput.trim()) {
      setEditingJob({
        ...editingJob,
        requiredSkills: [...editingJob.requiredSkills,
          editSkillInput.trim().toLowerCase()]
      });
      setEditSkillInput('');
    }
  };

  const removeEditSkill = (skill) => {
    setEditingJob({
      ...editingJob,
      requiredSkills: editingJob.requiredSkills.filter(s => s !== skill)
    });
  };

  const postJob = async () => {
    if (!jobForm.title || !jobForm.location) {
      toastWarning('Please fill in title and location!');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/jobs/create/${userId}`, jobForm);
      toastSuccess('Job posted successfully!');
      setShowForm(false);
      setJobForm({
        title: '', description: '', location: '',
        salaryRange: '', jobType: 'FULL_TIME',
        experienceRequired: 0, requiredSkills: []
      });
      loadJobs();
    } catch (err) {
      toastError('Error posting job!');
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm(
      'Are you sure you want to delete this job?')) {
      try {
        await axios.delete(
          `http://localhost:8080/api/jobs/delete/${jobId}`);
        setJobs(jobs.filter(job => job.id !== jobId));
        toastSuccess('Job deleted successfully!');
      } catch (err) {
        toastError('Error deleting job!');
      }
    }
  };

  const startEdit = (job) => {
    setEditingJob({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryRange: job.salaryRange,
      jobType: job.jobType,
      experienceRequired: job.experienceRequired,
      requiredSkills: job.requiredSkills
        ? [...job.requiredSkills] : []
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/jobs/update/${editingJob.id}`,
        {
          title: editingJob.title,
          description: editingJob.description,
          location: editingJob.location,
          salaryRange: editingJob.salaryRange,
          jobType: editingJob.jobType,
          experienceRequired: editingJob.experienceRequired,
          requiredSkills: editingJob.requiredSkills
        }
      );
      toastSuccess('Job updated successfully!');
      setEditingJob(null);
      loadJobs();
    } catch (err) {
      toastError('Error updating job!');
    }
  };

  const viewApplications = async (jobId, jobTitle) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/applications/job/${jobId}`);
      setSelectedJobApplications(res.data);
      setSelectedJobTitle(jobTitle);
      setShowApplications(true);
      setActiveTab('applications');
    } catch (err) {
      toastError('Error loading applications!');
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/applications/update/${applicationId}/status?status=${status}`
      );
      setSelectedJobApplications(
        selectedJobApplications.map(app =>
          app.id === applicationId
            ? { ...app, status: status } : app
        ));
      toastSuccess(`Application ${status} successfully!`);
    } catch (err) {
      toastError('Error updating status!');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const matchTone = (score) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const statusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'bg-success-subtle text-success-emphasis';
    if (status === 'REJECTED') return 'bg-danger-subtle text-danger-emphasis';
    if (status === 'REVIEWED') return 'bg-info-subtle text-info-emphasis';
    return 'bg-warning-subtle text-warning-emphasis';
  };

  const initials = (fullName || 'U')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-vh-100 bg-light">
      <nav className="app-navbar navbar navbar-expand px-4 py-3">
        <span className="navbar-brand fw-bold mb-0">
          <i className="bi bi-briefcase-fill"></i>
          Smart Job Portal
        </span>
        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="navbar-user-chip d-none d-sm-flex align-items-center gap-2">
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

      <div className="container py-4">
        <div className="row g-3 mb-4">
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#f0fdfa', color: '#14b8a6' }}>
                <i className="bi bi-list-ul"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">{jobs.length}</div>
                <div className="text-secondary small">Total Jobs</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#ecfdf5', color: '#16a34a' }}>
                <i className="bi bi-broadcast"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">
                  {jobs.filter(j => j.active).length}
                </div>
                <div className="text-secondary small">Active Listings</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
              <div className="icon-tile"
                style={{ background: '#fff7ed', color: '#f59e0b' }}>
                <i className="bi bi-archive"></i>
              </div>
              <div>
                <div className="fs-4 fw-bold text-dark lh-1">
                  {jobs.filter(j => !j.active).length}
                </div>
                <div className="text-secondary small">Closed Listings</div>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-pills gap-2 mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'jobs' ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('jobs')}>
              <i className="bi bi-list-ul me-1"></i>
              My Job Listings
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'applications' ? 'active' : 'text-secondary'}`}
              onClick={() => setActiveTab('applications')}>
              <i className="bi bi-people me-1"></i>
              Applications
              {selectedJobTitle && (
                <span className="badge bg-primary ms-2">
                  {selectedJobTitle}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-dark mb-0">My Job Listings</h4>
              <button className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}>
                <i className="bi bi-plus-lg me-1"></i>
                Post New Job
              </button>
            </div>

            {/* Post Job Form */}
            {showForm && (
              <div className="card shadow-sm border-0 p-4 mb-4">
                <h5 className="fw-bold text-dark mb-3">
                  Post a New Job
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Job Title</label>
                    <div className="input-icon">
                      <i className="bi bi-card-heading"></i>
                      <input className="form-control"
                        placeholder="e.g. Java Developer"
                        name="title" onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <div className="input-icon">
                      <i className="bi bi-geo-alt"></i>
                      <input className="form-control"
                        placeholder="e.g. Chennai"
                        name="location" onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Salary Range</label>
                    <div className="input-icon">
                      <i className="bi bi-cash-coin"></i>
                      <input className="form-control"
                        placeholder="e.g. 5-8 LPA"
                        name="salaryRange" onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Job Type</label>
                    <select className="form-select"
                      name="jobType" onChange={handleChange}>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Experience (years)
                    </label>
                    <div className="input-icon">
                      <i className="bi bi-briefcase"></i>
                      <input className="form-control" type="number"
                        name="experienceRequired"
                        onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows="3"
                      placeholder="Describe the role, responsibilities and expectations..."
                      name="description" onChange={handleChange}/>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Required Skills
                    </label>
                    <div className="d-flex gap-2">
                      <div className="input-icon flex-grow-1">
                        <i className="bi bi-tag"></i>
                        <input className="form-control"
                          placeholder="Type a skill e.g. java"
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyPress={e =>
                            e.key === 'Enter' && addSkill()}/>
                      </div>
                      <button
                        className="btn btn-outline-primary text-nowrap"
                        onClick={addSkill}>Add</button>
                    </div>
                    <div className="mt-2">
                      {jobForm.requiredSkills.map(s => (
                        <span key={s}
                          className="skill-chip badge bg-primary me-1 mb-1 py-2 px-3">
                          {s}
                          <button onClick={() => removeSkill(s)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success"
                    onClick={postJob}>
                    <i className="bi bi-check-lg me-1"></i>
                    Post Job
                  </button>
                  <button className="btn btn-outline-secondary"
                    onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Edit Job Form */}
            {editingJob && (
              <div className="card shadow-sm p-4 mb-4 border-warning">
                <h5 className="fw-bold text-warning mb-3">
                  <i className="bi bi-pencil-square me-1"></i>
                  Edit Job — {editingJob.title}
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Job Title</label>
                    <div className="input-icon">
                      <i className="bi bi-card-heading"></i>
                      <input className="form-control"
                        name="title"
                        value={editingJob.title}
                        onChange={handleEditChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <div className="input-icon">
                      <i className="bi bi-geo-alt"></i>
                      <input className="form-control"
                        name="location"
                        value={editingJob.location}
                        onChange={handleEditChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Salary Range</label>
                    <div className="input-icon">
                      <i className="bi bi-cash-coin"></i>
                      <input className="form-control"
                        name="salaryRange"
                        value={editingJob.salaryRange}
                        onChange={handleEditChange}/>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Job Type</label>
                    <select className="form-select"
                      name="jobType"
                      value={editingJob.jobType}
                      onChange={handleEditChange}>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows="3"
                      name="description"
                      value={editingJob.description}
                      onChange={handleEditChange}/>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Required Skills
                    </label>
                    <div className="d-flex gap-2">
                      <div className="input-icon flex-grow-1">
                        <i className="bi bi-tag"></i>
                        <input className="form-control"
                          placeholder="Add skill"
                          value={editSkillInput}
                          onChange={e =>
                            setEditSkillInput(e.target.value)}
                          onKeyPress={e =>
                            e.key === 'Enter' && addEditSkill()}/>
                      </div>
                      <button
                        className="btn btn-outline-primary text-nowrap"
                        onClick={addEditSkill}>Add</button>
                    </div>
                    <div className="mt-2">
                      {editingJob.requiredSkills &&
                        editingJob.requiredSkills.map(s => (
                        <span key={s}
                          className="skill-chip badge bg-primary me-1 mb-1 py-2 px-3">
                          {s}
                          <button
                            onClick={() => removeEditSkill(s)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-warning"
                    onClick={saveEdit}>
                    <i className="bi bi-check-lg me-1"></i>
                    Save Changes
                  </button>
                  <button className="btn btn-outline-secondary"
                    onClick={() => setEditingJob(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Job Listings */}
            {jobs.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-briefcase fs-1 d-block mb-2 text-secondary opacity-50"></i>
                <p className="text-secondary mb-3">No jobs posted yet.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Post Your First Job
                </button>
              </div>
            )}
            {jobs.map(job => (
              <div key={job.id}
                className="card card-hover shadow-sm border-0 mb-3 p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-bold text-dark">{job.title}</h5>
                  <span className={`badge ${
                    job.active
                      ? 'bg-success-subtle text-success-emphasis'
                      : 'bg-secondary-subtle text-secondary-emphasis'
                  }`}>
                    {job.active ? 'Active' : 'Closed'}
                  </span>
                </div>
                <p className="text-secondary mb-2">{job.description}</p>
                <p className="mb-2 text-secondary small">
                  <i className="bi bi-geo-alt me-1"></i>{job.location}
                  <span className="mx-2">&middot;</span>
                  <i className="bi bi-cash-coin me-1"></i>{job.salaryRange}
                  <span className="mx-2">&middot;</span>
                  <i className="bi bi-clock me-1"></i>{job.jobType}
                </p>
                <div className="mb-3">
                  {job.requiredSkills &&
                    job.requiredSkills.map(s => (
                    <span key={s}
                      className="badge bg-secondary-subtle text-secondary-emphasis me-1">{s}</span>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      viewApplications(job.id, job.title)}>
                    <i className="bi bi-people me-1"></i>
                    View Applications
                  </button>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => startEdit(job)}>
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteJob(job.id)}>
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h4 className="fw-bold text-dark mb-3">
              {showApplications
                ? `Applications for: ${selectedJobTitle}`
                : 'Applications'}
            </h4>
            {!showApplications && (
              <div className="text-center py-5">
                <i className="bi bi-people fs-1 d-block mb-2 text-secondary opacity-50"></i>
                <p className="text-secondary">
                  Click "View Applications" on any job to see candidates here.
                </p>
              </div>
            )}
            {showApplications &&
              selectedJobApplications.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                <p className="text-secondary">
                  No applications received yet.
                </p>
              </div>
            )}
            {selectedJobApplications.map(app => (
              <div key={app.id}
                className="card shadow-sm border-0 mb-3 p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-bold text-dark">
                    {app.jobSeeker.fullName}
                  </h5>
                  <span className={`badge fs-6 bg-${matchTone(app.matchScore)}-subtle text-${matchTone(app.matchScore)}-emphasis`}>
                    {app.matchScore}% Match
                  </span>
                </div>
                <p className="text-secondary mb-2 small">
                  <i className="bi bi-envelope me-1"></i>
                  {app.jobSeeker.email}
                </p>
                <div className="progress mb-2"
                  style={{height: '8px'}}>
                  <div
                    className={`progress-bar bg-${matchTone(app.matchScore)}`}
                    style={{width: `${app.matchScore}%`}}>
                  </div>
                </div>
                <div className="mb-2">
                  <strong className="small text-dark">Matched: </strong>
                  {app.matchedSkills &&
                    [...app.matchedSkills].map(s => (
                    <span key={s}
                      className="badge bg-success-subtle text-success-emphasis me-1">{s}</span>
                  ))}
                </div>
                <div className="mb-3">
                  <strong className="small text-dark">Missing: </strong>
                  {app.missingSkills &&
                    [...app.missingSkills].map(s => (
                    <span key={s}
                      className="badge bg-danger-subtle text-danger-emphasis me-1">{s}</span>
                  ))}
                </div>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <strong className="small text-dark">Status: </strong>
                  <span className={`badge ${statusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                  {app.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          updateStatus(app.id, 'ACCEPTED')}>
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          updateStatus(app.id, 'REJECTED')}>
                        Reject
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() =>
                          updateStatus(app.id, 'REVIEWED')}>
                        Mark Reviewed
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
