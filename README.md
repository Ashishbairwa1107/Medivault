# 🏥 MediVault – Digital Healthcare Platform  

## 🚀 Overview  
MediVault is a patient-centric digital healthcare platform designed to solve one of the biggest problems in modern healthcare — fragmented medical records across hospitals.

In traditional systems, patient data is locked within individual hospitals, leading to repeated tests, delayed diagnosis, and inefficient treatment. MediVault eliminates this by providing a centralized, secure, and accessible medical record system where patients control their data and can share it across multiple hospitals seamlessly.

The platform connects Patients, Doctors, and Hospitals under a unified system while ensuring privacy, security, and controlled access.

---

## 🎯 Core Objectives  
- Centralized storage of patient medical records  
- Patient-controlled data access & sharing  
- Digital prescriptions & reports generation  
- Multi-hospital interoperability  
- Seamless healthcare experience  
- Secure and scalable system for real-world use  

---

## ✨ Key Features  

### 🔐 Authentication & Authorization  
- Secure signup/login (JWT-based)  
- Role-based access (Patient / Doctor / Hospital Admin)  
- Protected routes & session handling  

### 👤 Patient System  
- Unique Patient ID (UPID) for global identity  
- View complete medical history  
- Control access permissions (grant/revoke)  
- Download/view reports & prescriptions  

### 👨‍⚕️ Doctor System  
- Add diagnosis, prescriptions, and treatment notes  
- Upload reports (image → PDF workflow)  
- Access patient records (with consent)  
- Digital consultation management  

### 🏥 Hospital System  
- Manage doctors & departments  
- Handle appointments and records  
- Institutional control with accountability  

### 🔄 Multi-Hospital Access  
- Patients can share records across hospitals  
- Eliminates repeated tests and delays  
- Improves treatment continuity  

### 🔒 Privacy & Security  
- Consent-based data sharing  
- Role-based access control  
- Audit logs for tracking access  
- Encrypted data handling  

---

## 🧠 System Architecture  
- Role-based architecture: Patient / Doctor / Hospital  
- Unique Patient ID as primary key  
- REST APIs for secure CRUD operations  
- Cloud-based file storage for reports  

---

## 🛠 Tech Stack  

### Frontend  
- React (Vite)  
- Tailwind CSS  
- Axios  

### Backend  
- Node.js  
- Express.js  

### Database  
- MongoDB (Mongoose)  

### Authentication & Security  
- JSON Web Tokens (JWT)  
- bcrypt hashing  

### File Storage  
- AWS S3 (for reports & prescriptions)  

### Tools  
- Postman (API testing)  
- MongoDB Compass  

---

## 📁 Project Structure  
