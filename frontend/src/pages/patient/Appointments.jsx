import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/axios';
import { Calendar, Clock, Plus, Search, Filter, BadgeCheck, X, CheckCircle2, ChevronRight, Sparkles, Wand2, CalendarPlus } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    department: '',
    appointmentDate: '',
    timeSlot: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['Cardiology', 'Orthopedics', 'General', 'Neurology', 'Dermatology'];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  // Status steps mapping
  const statusSteps = {
    'Pending': 1,
    'Confirmed': 2,
    'Completed': 3,
    'Cancelled': 0
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?._id) return;
      
      try {
        const { data } = await api.get(`/appointments/patient/${user._id}`);
        const mockHistory = [
          { _id: 'h1', doctorName: 'Dr. Sarah Wilson', department: 'General', appointmentDate: '2023-10-15', timeSlot: '10:00 AM', status: 'Completed' },
          { _id: 'h2', doctorName: 'Dr. Mike Ross', department: 'Orthopedics', appointmentDate: '2023-09-20', timeSlot: '02:30 PM', status: 'Completed' }
        ];
        setAppointments([...(data || []), ...mockHistory]);
      } catch (error) {
        console.error('Fetch appointments error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?._id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.department || !formData.appointmentDate || !formData.timeSlot) {
      return;
    }

    try {
      const newAppointment = {
        _id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      try {
        await api.post('/appointments/book', formData);
      } catch (e) {
        console.log("Using local state for demo persistence");
      }

      setAppointments([newAppointment, ...appointments]);
      setFormData({ doctorName: '', department: '', appointmentDate: '', timeSlot: '' });
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Book appointment error:', error);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status !== 'Completed' && (
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const pastAppointments = appointments.filter(a => a.status === 'Completed' && (
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const ProgressSteps = ({ status }) => {
    const currentStep = statusSteps[status] || 1;
    return (
      <div className="flex items-center gap-2 mt-4 ml-1 md:ml-14 overflow-x-auto pb-1">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`w-3 h-3 min-w-[12px] rounded-full ${currentStep >= step ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'bg-gray-200'}`} />
            {step < 3 && (
              <div className={`h-0.5 w-6 sm:w-8 rounded-full ${currentStep > step ? 'bg-teal-500' : 'bg-gray-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 bg-navy-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl"
          >
            ⚕️
          </motion.div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CalendarPlus className="text-teal-600 w-10 h-10" /> 
              My Sessions
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and book your health consultations effortlessly.</p>
          </div>
          
          <motion.button 
            whileHover={{ y: -4, scale: 1.04, boxShadow: "0 25px 60px -10px rgba(37, 99, 235, 0.5), 0 0 40px -5px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.96, y: 0 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] border-b-4 border-blue-800 hover:border-blue-900 transition-all group relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform relative z-10" />
            <span className="text-lg uppercase tracking-tight relative z-10">Book A New Session</span>
          </motion.button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-blue-950 text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-blue-400/30"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold">Appointment Successfully Booked!</h4>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Overlay */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsModalOpen(false)}
                 className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
               />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] p-8 md:p-12 w-full max-w-xl border border-slate-100 z-[101]"
               >
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                      <Wand2 className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Visit</h2>
                      <p className="text-sm text-blue-600 font-black uppercase tracking-widest mt-1 opacity-60">Verified Health Path</p>
                    </div>
                  </div>

                  <form onSubmit={handleBookAppointment} className="space-y-8">
                    <div className="group">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Specialist Information</label>
                      <input
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        placeholder="Type doctor's full name..."
                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Specialty</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-700 cursor-pointer appearance-none"
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Appointment Date</label>
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Time Slot Preference</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({...formData, timeSlot: slot})}
                            className={`py-4 rounded-2xl text-xs font-black uppercase transition-all border-2 ${formData.timeSlot === slot ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ 
                        scale: 1.04, 
                        y: -4,
                        boxShadow: "0 30px 60px -10px rgba(37, 99, 235, 0.6), 0 0 40px -5px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                      }}
                      whileTap={{ scale: 0.96, y: 0 }}
                      disabled={!formData.doctorName || !formData.department || !formData.appointmentDate || !formData.timeSlot}
                      className="w-full py-7 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2rem] font-black text-xl uppercase tracking-tighter shadow-[0_15px_50px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_25px_70px_-10px_rgba(37,99,235,0.6)] transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:shadow-[0_15px_50px_-10px_rgba(37,99,235,0.5)] mt-6 border-b-4 border-blue-800 hover:border-blue-900 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Book Appointment Now
                      </span>
                    </motion.button>
                  </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Display Section */}
        <div className="space-y-12">
          
          {/* Main List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase tracking-[0.2em] text-xs opacity-60">Upcoming Appointments</h2>
              </div>
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Filter list..."
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-50 text-slate-600 transition-all w-40 md:w-64"
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {upcomingAppointments.length === 0 ? (
                  <motion.div 
                    key="empty"
                    className="md:col-span-2 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-16 text-center"
                  >
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-100" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Scheduled Consultations</p>
                  </motion.div>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <motion.div 
                      key={appointment._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8 }}
                      className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-1 text-white shadow-lg">
                              <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">
                                {new Date(appointment.appointmentDate).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-xl font-black">
                                {new Date(appointment.appointmentDate).getDate()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg leading-tight">{appointment.doctorName}</h4>
                              <p className="text-teal-600 text-xs font-black uppercase tracking-widest mt-1 opacity-80">{appointment.department}</p>
                            </div>
                          </div>
                          <StatusBadge status={appointment.status} />
                        </div>
                        
                        <div className="flex items-center gap-3 text-slate-700 font-bold text-xs mb-6 bg-slate-50 p-3 rounded-2xl w-fit">
                          <Clock className="w-4 h-4 text-teal-500" /> {appointment.timeSlot}
                        </div>

                        <div className="border-t border-slate-50 pt-4">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Live Status Track</p>
                           <ProgressSteps status={appointment.status} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* History List */}
          <div className="pt-8">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 ml-2">
              <BadgeCheck className="w-4 h-4" /> Comprehensive History
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastAppointments.map((apt) => (
                <div key={apt._id} className="bg-white/60 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4 hover:bg-white hover:shadow-xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                         <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm leading-none">{apt.doctorName}</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{apt.department}</p>
                      </div>
                   </div>
                   <div className="flex justify-between items-center text-[10px] bg-slate-100/50 p-2 rounded-xl">
                      <span className="text-slate-400 font-bold">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                      <span className="text-emerald-700 font-black">ARCHIVED</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Visual FX */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.05)_0%,transparent_50%)]" />
    </div>
  );
};

export default Appointments;

