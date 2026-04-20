import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useDashboard } from '../../store/DashboardContext';
import Skeleton from '../../components/ui/Skeleton';
import { User, Mail, Phone, MapPin, Calendar, Droplets, CreditCard, PieChart, Shield, Edit3 } from 'lucide-react';
import api from '../../services/axios';
import EditProfileModal from '../../components/EditProfileModal';

const Profile = () => {
    const { user: authUser } = useAuth();
    const { loading: dashboardLoading } = useDashboard();
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setProfileLoading(true);
            const { data } = await api.get('/users/profile');
            setProfileData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data.');
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not set') return 'Not set';
        const birthDate = new Date(dob);
        if (isNaN(birthDate)) return 'Not set';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (profileLoading || dashboardLoading) {
        return (
            <div className="p-8">
                <Skeleton className="h-12 w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-48 rounded-2xl" />
                </div>
                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="fade-in max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="dash-header">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Patient Identity Profile</h2>
                    <p className="text-slate-500 mt-1">Verified Medical Information & Personal Data</p>
                </div>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-lg"
                    id="edit-profile-btn"
                >
                    <Edit3 className="w-6 h-6" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Name Card */}
                <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8" />
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <User className="w-7 h-7" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                        {profileData?.name || 'User'}
                    </div>
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">Full Identity Name</div>
                </div>

                {/* Blood Group Card */}
                <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-bl-[4rem] -mr-8 -mt-8" />
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                        <Droplets className="w-7 h-7" />
                    </div>
                    <div className={`text-3xl font-serif font-black mb-1 ${profileData?.bloodGroup === 'Not set' ? 'text-slate-300 italic' : 'text-slate-900 dark:text-white'}`}>
                        {profileData?.bloodGroup || 'Not set'}
                    </div>
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">Verified Blood Type</div>
                </div>

                {/* Age/DOB Card */}
                <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-[4rem] -mr-8 -mt-8" />
                    <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                        <Calendar className="w-7 h-7" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-1 flex items-baseline gap-2">
                        <span className={calculateAge(profileData?.dob) === 'Not set' ? 'text-slate-300 italic' : ''}>
                            {calculateAge(profileData?.dob)}
                        </span>
                        {calculateAge(profileData?.dob) !== 'Not set' && <span className="text-sm font-sans font-normal text-slate-400">Years Old</span>}
                    </div>
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">Calculated Age</div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="bg-slate-50/50 dark:bg-slate-800/30 px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <button className="text-primary font-bold border-b-4 border-primary pb-1 transition-all">Personal Details</button>
                    <button className="text-slate-400 font-medium hover:text-slate-600 transition-colors">Medical Baseline</button>
                    <button className="text-slate-400 font-medium hover:text-slate-600 transition-colors">Emergency Contacts</button>
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Email */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Email Address</span>
                            </div>
                            <div className="text-lg font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 opacity-70">
                                {profileData?.email || 'Not verified'}
                            </div>
                        </div>

                        {/* Phone */}
                        <div 
                            onClick={() => setIsEditModalOpen(true)}
                            className="space-y-3 cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-primary transition-colors">
                                <Phone className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Contact Number</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className={`text-lg font-medium bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-2xl border transition-all ${profileData?.phone === 'Not set' ? 'text-slate-300 italic border-slate-100' : 'text-slate-900 dark:text-white border-slate-100 group-hover:border-primary/30 group-hover:bg-primary/5'}`}>
                                {profileData?.phone || 'Not set'}
                            </div>
                        </div>

                         {/* Gender */}
                         <div 
                             onClick={() => setIsEditModalOpen(true)}
                             className="space-y-3 cursor-pointer group"
                         >
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-primary transition-colors">
                                <PieChart className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Gender</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className={`text-lg font-medium capitalize bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-2xl border transition-all ${profileData?.gender === 'Not set' ? 'text-slate-300 italic border-slate-100' : 'text-slate-900 dark:text-white border-slate-100 group-hover:border-primary/30 group-hover:bg-primary/5'}`}>
                                {profileData?.gender || 'Not set'}
                            </div>
                        </div>

                        {/* Aadhaar */}
                        <div 
                            onClick={() => setIsEditModalOpen(true)}
                            className="space-y-3 cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-primary transition-colors">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Government ID (Aadhaar)</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className={`text-lg font-bold tracking-[0.2em] px-6 py-4 rounded-2xl border flex items-center justify-between transition-all ${profileData?.aadhaar === 'Not set' || !profileData?.aadhaar ? 'text-slate-300 bg-slate-50 border-slate-100' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 border-blue-100 group-hover:border-blue-400'}`}>
                                <span>{profileData?.aadhaar ? `XXXX XXXX ${profileData.aadhaar.slice(-4)}` : 'Not set'}</span>
                                {profileData?.aadhaar && <div className="text-[10px] tracking-normal font-black uppercase bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md">VERIFIED</div>}
                            </div>
                        </div>

                        {/* Address */}
                        <div 
                            onClick={() => setIsEditModalOpen(true)}
                            className="md:col-span-2 space-y-3 cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 text-slate-400 group-hover:text-primary transition-colors">
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Permanent Residential Address</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className={`text-lg leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 px-8 py-6 rounded-[2.5rem] border transition-all min-h-[100px] ${profileData?.address === 'Not set' || !profileData?.address ? 'text-slate-300 italic border-slate-100' : 'text-slate-900 dark:text-white border-slate-100 group-hover:border-primary/30 group-hover:bg-primary/5'}`}>
                                {profileData?.address || 'Your secondary and permanent address details will appear here once verified.'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-16 flex flex-col items-center">
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/40 hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-3"
                        >
                            <Edit3 className="w-5 h-5" />
                            Update Full Identity Profile
                        </button>
                        <p className="mt-4 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">MediVault Secure Identity Storage</p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditProfileModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                initialData={profileData}
                onUpdateSuccess={fetchProfile}
            />
        </div>
    );
};

export default Profile;
