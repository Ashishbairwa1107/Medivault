import React, { useState, useEffect } from 'react';
import { X, User, Droplets, Calendar, Phone, MapPin, Save, Loader2, Mail, Shield } from 'lucide-react';
import api from '../services/axios';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, initialData, onUpdateSuccess }) => {
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bloodGroup: '',
        dob: '',
        phone: '',
        address: '',
        gender: '',
        aadhaar: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                bloodGroup: initialData.bloodGroup === 'Not set' ? '' : initialData.bloodGroup || '',
                dob: initialData.dob && initialData.dob !== 'Not set' ? new Date(initialData.dob).toISOString().split('T')[0] : '',
                phone: initialData.phone === 'Not set' ? '+91 ' : initialData.phone || '+91 ',
                address: initialData.address === 'Not set' ? '' : initialData.address || '',
                gender: initialData.gender === 'Not set' ? '' : initialData.gender || '',
                aadhaar: initialData.aadhaar === 'Not set' ? '' : initialData.aadhaar || ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateUser(formData);
            if (res.success) {
                toast.success('Profile updated successfully!');
                onUpdateSuccess();
                onClose();
            } else {
                toast.error(res.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Edit Personal Profile</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your verified health information</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-1">
                        {/* Email Address (Readonly) */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Mail size={12} className="text-primary" />
                                Email Address (Readonly)
                            </label>
                            <input
                                type="email"
                                value={initialData?.email || ''}
                                readOnly
                                className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all dark:text-slate-400 cursor-not-allowed font-medium"
                            />
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <User size={12} className="text-primary" />
                                Full Identity Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
                                placeholder="Patient Name"
                            />
                        </div>

                        {/* Blood Group */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Droplets size={12} className="text-red-500" />
                                Blood Group
                            </label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium appearance-none"
                            >
                                <option value="">Select</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Calendar size={12} className="text-amber-500" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Phone size={12} className="text-teal-500" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
                                placeholder="+91"
                            />
                        </div>

                         {/* Aadhaar Number */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Shield className="w-4 h-4 text-blue-500" />
                                Aadhaar / Government ID
                            </label>
                            <input
                                type="text"
                                name="aadhaar"
                                value={formData.aadhaar}
                                onChange={handleChange}
                                required
                                maxLength="12"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-bold tracking-[0.1em]"
                                placeholder="12 Digit Aadhaar Number"
                            />
                        </div>

                        {/* Gender */}
                         <div className="space-y-3 md:col-span-2 px-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Gender</label>
                            <div className="flex gap-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <label key={g} className="flex-1 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            px-4 py-3 rounded-xl border-2 text-center capitalize font-semibold transition-all
                                            ${formData.gender === g 
                                                ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/10' 
                                                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 group-hover:border-slate-200'}
                                        `}>
                                            {g}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <MapPin size={12} className="text-red-400" />
                                Permanent Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="2"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium resize-none"
                                placeholder="Enter your full residental address"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 px-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
