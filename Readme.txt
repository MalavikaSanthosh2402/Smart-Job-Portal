# Smart Job Portal System

A full-stack web application that connects **Job Seekers** and **Employers** through an intelligent job matching system. The application uses a skill-based matching algorithm to calculate a compatibility score between a candidate's skills and job requirements, helping employers identify suitable candidates and enabling job seekers to find relevant opportunities.

---

## 📌 Project Overview

The Smart Job Portal System is designed to simplify the recruitment process by providing a modern platform for job seekers and employers.

### Job Seekers can:
- Register and log in securely
- Create and update their profile
- Add and manage skills
- Upload resumes
- Search and filter jobs
- Apply for jobs
- View AI Match Score
- View missing skills required for a job

### Employers can:
- Register and log in
- Create company profiles
- Post job openings
- View applicants
- Review candidate match scores
- Update application status

---

## 🚀 Features

- Secure User Authentication
- Role-based Access (Job Seeker & Employer)
- Job Posting Management
- Job Search and Filtering
- Resume Upload
- AI Skill Match Score
- Skill Gap Analysis
- Application Tracking
- Responsive User Interface
- REST API Integration

---

## 🛠️ Technology Stack

### Frontend
- React.js 18
- Bootstrap 5
- HTML5
- CSS3
- JavaScript

### Backend
- Java 25
- Spring Boot 3.5
- Spring MVC
- Spring Data JPA
- Hibernate

### Database
- MySQL 8.0

### Build Tool
- Maven

### IDE
- IntelliJ IDEA

---

## 🏗️ System Architecture

```
React Frontend
        │
        ▼
REST APIs (HTTP)
        │
        ▼
Spring Boot Backend
        │
        ▼
Service Layer
        │
        ▼
Repository Layer (JPA/Hibernate)
        │
        ▼
MySQL Database
```

---

## 📂 Project Structure

```
Smart-Job-Portal/
│
├── job-portal-backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── config/
│   └── resources/
│
├── job-portal-frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
└── README.md
```

---

## 🧠 AI Match Score

The system compares the required job skills with the candidate's skills using a **Set Intersection** approach.

### Example

Job Skills

```
Java
Spring Boot
MySQL
Git
Maven
```

Candidate Skills

```
Java
Spring Boot
MySQL
Git
```

Match Score

```
4 / 5 × 100 = 80%
```

The system also displays missing skills to help candidates improve their profiles.

---

## 🗄️ Database

The application uses MySQL with normalized relational tables, including:

- Users
- Job Seekers
- Employers
- Skills
- Job Listings
- Job Skills
- Applications
- Candidate Skills
- Resume Information

---

## 🔐 Security

- BCrypt Password Encryption
- Role-based Authorization
- Input Validation
- Secure REST APIs

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/USERNAME/Smart-Job-Portal.git
```

Replace **USERNAME** with your GitHub username.

---

### Backend

```bash
cd job-portal-backend

mvn clean install

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

### Frontend

```bash
cd job-portal-frontend

npm install

npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🖼️ Screenshots

Add screenshots of the following pages:

- Home Page
- Login Page
- Registration Page
- Job Listings
- Employer Dashboard
- Job Seeker Dashboard
- AI Match Score
- Application Management

Example:

```
screenshots/
    home.png
    login.png
    dashboard.png
    match-score.png
```

---

## 📖 Future Enhancements

- JWT Authentication
- Resume Parsing using NLP
- Email Notifications
- Interview Scheduling
- LinkedIn Integration
- Mobile Application
- Admin Dashboard
- Cloud Deployment (AWS/Azure)

---

## 🧪 Testing

The system has been tested for:

- User Registration
- Login Authentication
- Job Posting
- Job Search
- Resume Upload
- Job Application
- Match Score Calculation
- Skill Gap Detection

---

## 👩‍💻 Author

**Malavika Santhosh**

Bachelor of Computer Applications (BCA)

---

## 📜 License

This project was developed for educational purposes as part of the Bachelor of Computer Applications (BCA) Major Project.