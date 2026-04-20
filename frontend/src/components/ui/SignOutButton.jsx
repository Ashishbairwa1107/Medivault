import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

const SignOutButton = ({ 
  variant = 'sidebar', // 'sidebar' or 'topbar'
  label = 'Sign Out',
  className = ''
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleAction = async () => {
    try {
      await logout(); // Context handles clearing localStorage and setting user to null
    } catch (e) {
      console.error(e);
    }
    // Navigate to /auth with replace: true to prevent back button from going back to dashboard
    navigate('/auth', { replace: true });
  };

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          onClick={handleAction}
          className={`flex items-center gap-4 text-white/80 hover:bg-white/10 hover:text-white font-bold transition-all duration-200 w-full px-6 py-3 border-l-4 border-transparent hover:border-teal-400 outline-none cursor-pointer ${className}`}
        >
          <LogOut className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ) : (
        <button
          onClick={handleAction}
          className={`flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all duration-200 font-semibold cursor-pointer outline-none ${className}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{label}</span>
        </button>
      )}
    </>
  );
};

export default SignOutButton;
