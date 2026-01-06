import React from 'react';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
    const { currentView } = useApp();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gold-50 p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brown-900 capitalize">
                    {currentView === 'dashboard' ? 'Painel de Controle' :
                        currentView === 'patients' ? 'Gestão de Pacientes' :
                            currentView === 'doctors' ? 'Corpo Clínico' :
                                currentView === 'schedule' ? 'Agenda de Atendimentos' :
                                    currentView === 'booking' ? 'Novo Agendamento' : currentView}
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gold-600 font-medium">Unidade Central</span>
                    <button className="p-2 hover:bg-gold-50 rounded-full transition-colors text-gold-DEFAULT">
                        🔔
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
