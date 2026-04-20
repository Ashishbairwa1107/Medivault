import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import DoctorRecordModal from '../../components/doctor/DoctorRecordModal';

export const DoctorContext = React.createContext(null);

const DoctorDashboardPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const openModal = useCallback((patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setSelectedPatient(null);
    }, []);

    return (
        <DoctorContext.Provider value={{ openModal, closeModal, selectedPatient }}>
            <AppShell>
                <div style={{ padding: '28px' }}>
                    <Outlet />
                </div>
                {showModal && selectedPatient && (
                    <DoctorRecordModal patient={selectedPatient} onClose={closeModal} />
                )}
            </AppShell>
        </DoctorContext.Provider>
    );
};

export default DoctorDashboardPage;
