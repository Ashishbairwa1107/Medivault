export const mockDoctors = [
  { id: 'd1', name: 'Dr. Anoop Sharma', specialization: 'Cardiology', hospital: 'AIIMS Delhi', status: 'Active' },
  { id: 'd2', name: 'Dr. Meera Patel', specialization: 'Neurology', hospital: 'Apollo Hospitals', status: 'Active' },
  { id: 'd3', name: 'Dr. Ramesh Kumar', specialization: 'Orthopedics', hospital: 'Fortis Healthcare', status: 'Pending' },
  { id: 'd4', name: 'Dr. Priya Singh', specialization: 'Pediatrics', hospital: 'Max Super Speciality', status: 'Active' },
  { id: 'd5', name: 'Dr. Vikram Desai', specialization: 'Oncology', hospital: 'Tata Memorial', status: 'Active' },
  { id: 'd6', name: 'Dr. Sneha Reddy', specialization: 'Dermatology', hospital: 'Manipal Hospitals', status: 'Pending' },
  { id: 'd7', name: 'Dr. Amit Bansal', specialization: 'Gastroenterology', hospital: 'AIIMS Delhi', status: 'Active' },
  { id: 'd8', name: 'Dr. Neha Verma', specialization: 'Endocrinology', hospital: 'Apollo Hospitals', status: 'Active' },
  { id: 'd9', name: 'Dr. Rajesh Iyer', specialization: 'Ophthalmology', hospital: 'Sankara Nethralaya', status: 'Active' },
  { id: 'd10', name: 'Dr. Kiran Rao', specialization: 'Psychiatry', hospital: 'NIMHANS', status: 'Pending' }
];

export const mockPatients = [
  { id: 'p1', name: 'Arjun Das', age: 34, gender: 'Male', lastVisit: '2023-10-15' },
  { id: 'p2', name: 'Lakshmi Nair', age: 29, gender: 'Female', lastVisit: '2023-11-02' },
  { id: 'p3', name: 'Sanjay Gupta', age: 45, gender: 'Male', lastVisit: '2023-09-20' },
  { id: 'p4', name: 'Anjali Menon', age: 52, gender: 'Female', lastVisit: '2023-12-01' },
  { id: 'p5', name: 'Ravi Kumar', age: 22, gender: 'Male', lastVisit: '2023-11-18' },
  { id: 'p6', name: 'Pooja Joshi', age: 31, gender: 'Female', lastVisit: '2023-10-05' },
  { id: 'p7', name: 'Karan Singh', age: 60, gender: 'Male', lastVisit: '2023-12-10' },
  { id: 'p8', name: 'Divya Sharma', age: 27, gender: 'Female', lastVisit: '2023-08-30' },
  { id: 'p9', name: 'Vikash Yadav', age: 38, gender: 'Male', lastVisit: '2023-11-25' },
  { id: 'p10', name: 'Simran Kaur', age: 41, gender: 'Female', lastVisit: '2023-09-12' },
  { id: 'p11', name: 'Rahul Bose', age: 25, gender: 'Male', lastVisit: '2023-10-22' },
  { id: 'p12', name: 'Ananya Chatterjee', age: 35, gender: 'Female', lastVisit: '2023-11-08' },
  { id: 'p13', name: 'Tarun Patel', age: 50, gender: 'Male', lastVisit: '2023-12-05' },
  { id: 'p14', name: 'Neha Gupta', age: 28, gender: 'Female', lastVisit: '2023-09-01' },
  { id: 'p15', name: 'Mohit Agarwal', age: 44, gender: 'Male', lastVisit: '2023-11-15' },
  { id: 'p16', name: 'Riya Sen', age: 33, gender: 'Female', lastVisit: '2023-10-10' },
  { id: 'p17', name: 'Abhishek Jain', age: 29, gender: 'Male', lastVisit: '2023-12-12' },
  { id: 'p18', name: 'Ishita Banerjee', age: 46, gender: 'Female', lastVisit: '2023-08-15' },
  { id: 'p19', name: 'Suraj Reddy', age: 37, gender: 'Male', lastVisit: '2023-11-30' },
  { id: 'p20', name: 'Manasi Patil', age: 55, gender: 'Female', lastVisit: '2023-09-28' }
];

export const mockConsents = [
  { id: 'c1', patientName: 'Arjun Das', requestedBy: 'Dr. Anoop Sharma', status: 'Approved' },
  { id: 'c2', patientName: 'Lakshmi Nair', requestedBy: 'Dr. Meera Patel', status: 'Pending' },
  { id: 'c3', patientName: 'Sanjay Gupta', requestedBy: 'Dr. Ramesh Kumar', status: 'Expired' },
  { id: 'c4', patientName: 'Anjali Menon', requestedBy: 'Dr. Priya Singh', status: 'Approved' },
  { id: 'c5', patientName: 'Ravi Kumar', requestedBy: 'Dr. Vikram Desai', status: 'Pending' }
];

export const mockUploads = [
  { id: 'u1', recordName: 'Blood_Test_Report.pdf', type: 'Lab Result', uploadDate: '2023-12-10' },
  { id: 'u2', recordName: 'MRI_Scan_Brain.jpg', type: 'Imaging', uploadDate: '2023-12-08' },
  { id: 'u3', recordName: 'ECG_Analysis.pdf', type: 'Diagnostics', uploadDate: '2023-12-05' },
  { id: 'u4', recordName: 'Prescription_Nov.png', type: 'Prescription', uploadDate: '2023-11-20' },
  { id: 'u5', recordName: 'Discharge_Summary.pdf', type: 'Summary', uploadDate: '2023-10-15' }
];

export const mockPerformanceData = [
  { name: 'Jan', consultations: 400, surgeries: 240, admissions: 300 },
  { name: 'Feb', consultations: 300, surgeries: 139, admissions: 220 },
  { name: 'Mar', consultations: 200, surgeries: 980, admissions: 229 },
  { name: 'Apr', consultations: 278, surgeries: 390, admissions: 200 },
  { name: 'May', consultations: 189, surgeries: 480, admissions: 218 },
  { name: 'Jun', consultations: 239, surgeries: 380, admissions: 250 },
  { name: 'Jul', consultations: 349, surgeries: 430, admissions: 210 },
];

export const mockStaff = [
  { id: 's1', name: 'Ravi Verma', role: 'IT Administrator', department: 'IT', status: 'Active' },
  { id: 's2', name: 'Neha Chawla', role: 'HR Manager', department: 'Human Resources', status: 'Active' },
  { id: 's3', name: 'Amit Singh', role: 'Data Analyst', department: 'Analytics', status: 'On Leave' },
  { id: 's4', name: 'Suman Rao', role: 'Compliance Officer', department: 'Legal', status: 'Active' },
  { id: 's5', name: 'Tarun Mehra', role: 'System Admin', department: 'IT', status: 'Pending' }
];

export const mockAuditLogs = [
  { id: 'al1', user: 'Dr. Anoop Sharma', action: 'Approved Consent c1', date: '2023-12-11 14:05', ip: '192.168.1.101' },
  { id: 'al2', user: 'Admin', action: 'Created new staff: Neha Chawla', date: '2023-12-10 09:20', ip: '10.0.0.5' },
  { id: 'al3', user: 'System', action: 'Daily Backup Completed', date: '2023-12-10 02:00', ip: 'localhost' },
  { id: 'al4', user: 'Dr. Meera Patel', action: 'Viewed Patient p2 records', date: '2023-12-09 11:30', ip: '192.168.1.105' },
  { id: 'al5', user: 'Dr. Ramesh Kumar', action: 'Failed Login Attempt', date: '2023-12-08 17:45', ip: '45.22.19.4' }
];

export const mockReports = [
  { id: 'r1', reportName: 'Monthly Consultations - Nov', generatedBy: 'System', date: '2023-12-01' },
  { id: 'r2', reportName: 'Consent Expiry Forecast', generatedBy: 'Ravi Verma', date: '2023-12-05' },
  { id: 'r3', reportName: 'Weekly Patient Growth', generatedBy: 'Admin', date: '2023-12-08' },
  { id: 'r4', reportName: 'Audit Trail Summary Q3', generatedBy: 'Suman Rao', date: '2023-10-31' },
  { id: 'r5', reportName: 'Department Performance', generatedBy: 'Admin', date: '2023-12-11' }
];
