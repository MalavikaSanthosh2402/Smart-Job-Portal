import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'bi-graph-up-arrow',
      tint: '#f0fdfa',
      color: '#14b8a6',
      title: 'AI Match Score',
      text: 'Get an instant compatibility score between your skills and job requirements.'
    },
    {
      icon: 'bi-lightbulb',
      tint: '#fff7ed',
      color: '#f59e0b',
      title: 'Skill Gap Analysis',
      text: 'Identify missing skills and know exactly what to learn for your dream job.'
    },
    {
      icon: 'bi-people',
      tint: '#ecfdf5',
      color: '#16a34a',
      title: 'Smart Matching',
      text: 'Employers get ranked applications based on candidate match scores.'
    }
  ];

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      {/* Navbar */}
      <nav className="app-navbar navbar navbar-expand px-4 py-3">
        <span className="navbar-brand fw-bold fs-4 mb-0">
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
            onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section py-5">
        <div className="container text-center py-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3 fw-semibold text-primary">
            AI-Powered Hiring
          </span>
          <h1 className="display-4 fw-bold text-dark mb-3">
            Find Your Dream Job
          </h1>
          <p className="lead text-secondary col-lg-7 mx-auto mb-4">
            AI-powered resume matching to connect the right talent
            with the right opportunity, faster.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-primary btn-lg px-4 shadow-sm"
              onClick={() => navigate('/register')}>
              Get Started
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
            <button
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => navigate('/jobs')}>
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container py-5 flex-grow-1">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Why choose us</h2>
          <p className="text-secondary">
            Everything you need to land the right role or the right hire.
          </p>
        </div>
        <div className="row g-4">
          {features.map(f => (
            <div className="col-md-4" key={f.title}>
              <div className="card card-hover shadow-sm border-0 p-4 h-100">
                <div
                  className="icon-tile mb-3"
                  style={{ background: f.tint, color: f.color }}>
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h5 className="fw-bold text-dark">{f.title}</h5>
                <p className="text-secondary mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-top py-4 bg-light">
        <div className="container d-flex justify-content-between flex-wrap gap-2">
          <span className="text-secondary small">
            &copy; {new Date().getFullYear()} Smart Job Portal. All rights reserved.
          </span>
          <span className="text-secondary small">
            Built to connect talent with opportunity.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
