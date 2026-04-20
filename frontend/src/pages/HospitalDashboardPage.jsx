import React from 'react';
import { Outlet } from 'react-router-dom';
import AppShell from '../layouts/AppShell';

const HospitalDashboardPage = () => {
    return (
        <AppShell>
            <div style={{ padding: '28px' }}>
                <Outlet />
            </div>
        </AppShell>
    );
};

export default HospitalDashboardPage;