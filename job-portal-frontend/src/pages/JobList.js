import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchJobType, setSearchJobType] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/jobs/all')
      .then(res => {
        setJobs(res.data);
        setFilteredJobs(res.data);
      })
      .catch(err => console.log(err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    setFilteredJobs(jobs);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="app-navbar navbar navbar-expand px-4 py-3">
        <span className="navbar-brand fw-bold mb-0">
          <i className="bi bi-briefcase-fill"></i>
          Smart Job Portal
        </span>
        <div className="ms-auto d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/login')}>
            Login
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </nav>

      <div className="container py-4">
        <h3 className="fw-bold text-dark mb-4">Browse All Jobs</h3>

        {/* Search Bar */}
        <div className="card shadow-sm border-0 p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <div className="input-icon">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
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
                  placeholder="Location..."
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
                Clear
              </button>
              <span className="text-secondary ms-2 small">
                {filteredJobs.length} result(s) found
              </span>
            </div>
          )}
        </div>

        {/* Job Cards */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-search fs-1 d-block mb-2 opacity-50"></i>
            No jobs found.
          </div>
        )}
        {filteredJobs.map(job => (
          <div key={job.id} className="card card-hover shadow-sm border-0 mb-3 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="fw-bold text-dark">{job.title}</h5>
              <span className="badge bg-info-subtle text-info-emphasis">
                {job.jobType}
              </span>
            </div>
            <p className="text-secondary mb-2">{job.description}</p>
            <p className="mb-2 text-secondary small">
              <i className="bi bi-geo-alt me-1"></i>{job.location}
              <span className="mx-2">&middot;</span>
              <i className="bi bi-cash-coin me-1"></i>{job.salaryRange}
            </p>
            <p className="mb-3">
              <strong className="small text-dark">Required Skills: </strong>
              {job.requiredSkills &&
                job.requiredSkills.map(s => (
                  <span key={s}
                    className="badge bg-primary-subtle text-primary-emphasis me-1">{s}</span>
                ))}
            </p>
            <div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login')}>
                Login to Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
