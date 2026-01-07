import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Schedule from './pages/Schedule';
import Doctors from './pages/Doctors';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AppointmentsList from './pages/AppointmentsList';

const AppContent: React.FC = () => {
    const { currentView, isAuthenticated, currentUser, isLoading } = useApp();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white/5 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-DEFAULT border-t-transparent"></div>
                    <p className="text-brown-900/60 font-medium animate-pulse">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    const renderView = () => {
        // Basic RBAC check for view rendering
        if (currentUser?.role === 'health_professional' && !['dashboard', 'patients', 'appointments_list'].includes(currentView)) {
            return <Admin />; // Or some "Unauthorized" page
        }

        switch (currentView) {
            case 'dashboard':
                return <Admin />;
            case 'patients':
                return <Patients />;
            case 'doctors':
                return <Doctors />;
            case 'schedule':
                return <Schedule />;
            case 'users':
                return <Users />;
            case 'appointments_list':
                return <AppointmentsList />;
            default:
                return <Admin />;
        }
    };

    return <Layout>{renderView()}</Layout>;
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
