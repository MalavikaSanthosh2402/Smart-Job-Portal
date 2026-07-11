import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login', formData);
      const data = response.data;
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);
      localStorage.setItem('fullName', data.fullName);

      if (data.role === 'JOB_SEEKER') {
        navigate('/jobseeker/dashboard');
      } else {
        navigate('/employer/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password!');
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
            <h2 className="fw-bold mb-3">Welcome back.</h2>
            <p className="opacity-75 mb-0">
              Sign in to track your applications, manage your skills,
              and get matched with the right opportunities.
            </p>
          </div>
          <span className="opacity-75 small">
            &copy; {new Date().getFullYear()} Smart Job Portal
          </span>
        </div>

        {/* Form panel */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            <span
              className="navbar-brand fw-bold fs-4 d-lg-none d-flex mb-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}>
              <i className="bi bi-briefcase-fill text-primary me-2"></i>
              Smart Job Portal
            </span>
            <h3 className="fw-bold text-dark mb-1">Login</h3>
            <p className="text-secondary mb-4">
              Enter your credentials to access your account.
            </p>

            {error && (
              <div className="alert alert-danger py-2 small">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <div className="input-icon input-icon-lg">
                  <i className="bi bi-envelope"></i>
                  <input type="email" className="form-control form-control-lg"
                    placeholder="you@example.com"
                    name="email" onChange={handleChange} required/>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-icon input-icon-lg">
                  <i className="bi bi-lock"></i>
                  <input type="password" className="form-control form-control-lg"
                    placeholder="••••••••"
                    name="password" onChange={handleChange} required/>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                Login
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </form>

            <p className="text-center text-secondary mt-4">
              No account?{' '}
              <span className="text-primary fw-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/register')}>
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
