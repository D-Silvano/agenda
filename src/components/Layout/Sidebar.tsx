import React from 'react';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
    const { currentView, setCurrentView, logout, currentUser } = useApp();

    const menuItems = [
        { id: 'dashboard' as const, label: 'Dashboard', icon: '📊', roles: ['administrator', 'health_professional'] },
        { id: 'patients' as const, label: 'Pacientes', icon: '👥', roles: ['administrator', 'health_professional'] },
        { id: 'appointments_list' as const, label: 'Agendamento', icon: '🔔', roles: ['health_professional'] },
        { id: 'doctors' as const, label: 'Médicos', icon: '👨‍⚕️', roles: ['administrator'] },
        { id: 'schedule' as const, label: 'Agenda', icon: '📅', roles: ['administrator'] },
        { id: 'users' as const, label: 'Cadastrar novo usuário', icon: '➕', roles: ['administrator'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        currentUser && item.roles.includes(currentUser.role)
    );

    return (
        <aside className="w-64 bg-white border-r border-gold-100 h-screen fixed left-0 top-0 flex flex-col shadow-lg shadow-gold-50">
            <div className="p-6 border-b border-gold-50">
                <h1 className="text-2xl font-bold text-gold-DEFAULT tracking-tight">MediAgenda</h1>
                <p className="text-xs text-gold-600 font-medium tracking-widest uppercase mt-1">Excelência Médica</p>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {filteredMenuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setCurrentView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${currentView === item.id
                                    ? 'bg-gold-50 text-gold-dark font-semibold border border-gold-100 shadow-sm'
                                    : 'text-brown-900 opacity-60 hover:bg-gold-50/50 hover:opacity-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gold-50">
                <div className="flex flex-col gap-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-light rounded-full flex items-center justify-center flex-shrink-0 animate-fade-in shadow-inner">
                            <span className="text-brown-900 font-semibold">
                                {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-brown-900 truncate">{currentUser?.name || 'Admin'}</p>
                            <p className="text-[10px] text-brown-900/60 uppercase tracking-wider font-medium">
                                {currentUser?.role === 'administrator' ? 'Administrador' : 'Profissional de Saúde'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-fit flex items-center justify-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-md font-medium text-xs"
                    >
                        <span>Sair</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
