import React from 'react';
import { Outlet } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { useDashboard } from '../../store/DashboardContext';
import UploadReportModal from '../../components/UploadReportModal';
import ViewReportModal from '../../components/ViewReportModal';

const PatientDashboardPage = () => {
    const { showUploadModal, toggleUploadModal, handleUploadRecord, showViewModal, selectedRecord, toggleViewModal } = useDashboard();

    return (
        <AppShell>
            <div style={{ padding: '28px' }}>
                <Outlet />
            </div>
            
            <UploadReportModal 
              isOpen={showUploadModal} 
              onClose={toggleUploadModal}
              onSuccess={handleUploadRecord} 
            />
            
            <ViewReportModal 
              isOpen={showViewModal}
              record={selectedRecord}
              onClose={toggleViewModal}
            />
        </AppShell>
    );
};

export default PatientDashboardPage;
