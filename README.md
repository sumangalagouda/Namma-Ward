# 🏙️ Namma Ward – Civic Issue Reporting & Ward Management System

Namma Ward is a full-stack civic-tech web application that enables citizens to digitally report local civic issues such as sanitation, roads, water supply, and infrastructure problems.  
The system automatically routes complaints to the nearest ward officers, tracks resolution status, and improves transparency between citizens and authorities.

Built to replace slow, manual complaint handling with a faster, accountable, and scalable digital workflow.

---

## 🚀 Problem

Traditional civic complaint systems often suffer from:
- Manual processes and delays
- No real-time status tracking
- Poor transparency
- Low citizen engagement
- Lack of accountability

---

## 💡 Solution

Namma Ward provides a centralized digital platform where:
- Citizens submit complaints with images and location
- Issues are auto-routed to responsible ward officers
- Status is tracked in real-time
- Officers manage and resolve issues efficiently
- Gamification encourages citizen participation

---

## ✨ Features

### 👤 Citizen
- Register/Login authentication
- Submit complaints with photos
- Geo-based ward mapping
- Track complaint status
- View complaint history
- Earn reward points

### 🧑‍💼 Officer
- Ward-based issue assignment
- Update complaint status
- Manage multiple complaints
- Dashboard view

### 🛠️ Admin
- Manage wards & officers
- Monitor complaints
- Track system activity

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Flask (Python)
- REST APIs
- JWT Authentication
- APScheduler

### Database
- MySQL
- SQLAlchemy ORM

### Deployment & Tools
- Render
- Git & GitHub
- Postman

---

## 🧠 System Architecture

Citizen (React UI)  
↓  
Flask REST APIs  
↓  
Business Logic (Routing + SLA + Gamification)  
↓  
MySQL Database  
↓  
Officer/Admin Dashboards  

---

## 📂 Project Structure

namma-ward/
│
├── frontend/ # React application
├── backend/ # Flask APIs
├── models/ # Database models
├── routes/ # API routes
├── static/uploads/ # Complaint images
├── requirements.txt
└── README.md
