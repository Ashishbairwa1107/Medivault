import React from 'react';

/**
 * StatCard — Reusable analytical metric card for the Hospital Dashboard.
 * Props:
 *   icon     — emoji or SVG element
 *   label    — string
 *   value    — string/number
 *   delta    — change caption e.g. "+48 this week"
 *   deltaPos — boolean (green) or false (red)
 *   accent   — CSS color for icon bg
 *   onClick  — optional click handler
 *   clickable— shows hover pointer + ring
 */
const StatCard = ({ icon, label, value, delta, deltaPos = true, accent = '#dbeafe', onClick, clickable }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.04)] h-full flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                clickable 
                  ? 'cursor-pointer hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-blue-200' 
                  : ''
            }`}
            style={{ minWidth: 180 }}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-8 -translate-y-8`} style={{ background: accent }}></div>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                        {label}
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform" style={{ background: accent }}>
                        {icon}
                    </div>
                </div>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-4 tracking-tight">
                    {value}
                </div>
            </div>
            {delta && (
                <div className="flex items-center gap-1.5 mt-auto">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        deltaPos ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        <span className={deltaPos ? 'text-emerald-500' : 'text-rose-500'}>
                            {deltaPos ? '▲' : '▼'}
                        </span>
                        {delta}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatCard;

