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

medivault/
├── frontend/ → React Application
├── backend/ → Express API Server
├── README.md


---

## ⚙️ Setup Instructions  

### 1️⃣ Clone Repository  

git clone https://github.com/YOUR_USERNAME/medivault.git

cd medivault

2️⃣ Backend Setup

cd backend

npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket

Run server:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔐 Environment Variables

Make sure .env is inside /backend

⚠️ Never push .env to GitHub

📊 Current Status

✅ Authentication system implemented

✅ Role-based dashboards created

✅ Medical records system working

✅ File upload (reports) integrated

🚧 Consent management enhancements

🚧 Advanced analytics & reporting


🎯 Future Scope

AI-based clinical decision support (assistive)

Telemedicine (video consultations)

Mobile application (Patient & Doctor apps)

Health analytics & disease trend insights

Government-level healthcare integration


👨‍💻 Author

Ashish Bairwa

B.Tech IT | Guru Ghasidas Vishwavidyalaya

⭐ Note

This project is built as a real-world scalable healthcare solution prototype, focusing on patient empowerment, data security, and system interoperability. Continuous improvements are being made to enhance usability and performance.
