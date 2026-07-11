import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '',
    role: 'JOB_SEEKER', companyName: '', phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try again!');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-stretch bg-white">
      <div className="row g-0 w-100">
        {/* Branding panel */}
        <div className="col-lg-5 auth-side-panel d-none d-lg-flex flex-column justify-content-between p-5">
          <span className="navbar-brand fw-bold fs-4 text-white">
            <i className="bi bi-briefcase-fill me-2"></i>
            Smart Job Portal
          </span>
          <div>
            <h2 className="fw-bold mb-3">Join the platform.</h2>
            <p className="opacity-75 mb-0">
              Create an account as a job seeker to get matched with roles,
              or as an employer to find ranked, qualified candidates.
            </p>
          </div>
          <span className="opacity-75 small">
            &copy; {new Date().getFullYear()} Smart Job Portal
          </span>
        </div>

        {/* Form panel */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 py-5">
          <div className="w-100" style={{ maxWidth: '460px' }}>
            <span
              className="navbar-brand fw-bold fs-4 d-lg-none d-flex mb-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}>
              <i className="bi bi-briefcase-fill text-primary me-2"></i>
              Smart Job Portal
            </span>
            <h3 className="fw-bold text-dark mb-1">Create your account</h3>
            <p className="text-secondary mb-4">
              It only takes a minute to get started.
            </p>

            {error && (
              <div className="alert alert-danger py-2 small">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Register As</label>
                <div className="row g-2">
                  {[
                    { value: 'JOB_SEEKER', label: 'Job Seeker', icon: 'bi-person-workspace' },
                    { value: 'EMPLOYER', label: 'Employer', icon: 'bi-building' }
                  ].map(opt => (
                    <div className="col-6" key={opt.value}>
                      <div
                        className={`card border-2 p-3 text-center h-100 ${
                          formData.role === opt.value
                            ? 'border-primary bg-primary-subtle'
                            : 'border-light-subtle'
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFormData({ ...formData, role: opt.value })}>
                        <i className={`bi ${opt.icon} fs-4 ${
                          formData.role === opt.value ? 'text-primary' : 'text-secondary'
                        }`}></i>
                        <div className={`fw-semibold small mt-1 ${
                          formData.role === opt.value ? 'text-primary' : 'text-dark'
                        }`}>
                          {opt.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <div className="input-icon">
                  <i className="bi bi-person"></i>
                  <input type="text" className="form-control"
                    name="fullName" onChange={handleChange} required/>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <div className="input-icon">
                  <i className="bi bi-envelope"></i>
                  <input type="email" className="form-control"
                    name="email" onChange={handleChange} required/>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-icon">
                  <i className="bi bi-lock"></i>
                  <input type="password" className="form-control"
                    name="password" onChange={handleChange} required/>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <div className="input-icon">
                  <i className="bi bi-telephone"></i>
                  <input type="text" className="form-control"
                    name="phoneNumber" onChange={handleChange}/>
                </div>
              </div>
              {formData.role === 'EMPLOYER' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Company Name</label>
                  <div className="input-icon">
                    <i className="bi bi-building"></i>
                    <input type="text" className="form-control"
                      name="companyName" onChange={handleChange}/>
                  </div>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm mt-2">
                Register
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </form>

            <p className="text-center text-secondary mt-4">
              Already have an account?{' '}
              <span className="text-primary fw-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/login')}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
