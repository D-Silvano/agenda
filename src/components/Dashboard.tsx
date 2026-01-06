import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
    const { patients, appointments, doctors, setCurrentView, currentUser } = useApp();

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter((apt) => apt.date === today);
    const scheduledAppointments = appointments.filter((apt) => apt.status === 'scheduled');

    const stats = [
        {
            label: 'Total de Pacientes',
            value: patients.length,
            icon: '👥',
            color: 'bg-gold-50 text-gold-dark',
        },
        {
            label: 'Consultas Hoje',
            value: todayAppointments.length,
            icon: '📅',
            color: 'bg-green-50 text-green-600',
        },
        {
            label: 'Consultas Agendadas',
            value: scheduledAppointments.length,
            icon: '⏰',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            label: 'Médicos Ativos',
            value: doctors.length,
            icon: '⚕️',
            color: 'bg-orange-50 text-orange-600',
        },
    ];

    const getPatientName = (patientId: string) => {
        const patient = patients.find((p) => p.id === patientId);
        return patient?.name || 'Desconhecido';
    };

    const getDoctorName = (doctorId: string) => {
        const doctor = doctors.find((d) => d.id === doctorId);
        return doctor?.name || 'Desconhecido';
    };

    const recentAppointments = [...appointments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-brown-900 opacity-60 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-brown-900">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Appointments */}
            <div className="card">
                <h3 className="text-xl font-semibold text-brown-900 mb-4">Consultas Recentes</h3>
                {recentAppointments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhuma consulta registrada</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentAppointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="flex items-center justify-between p-4 bg-gold-50/30 rounded-lg hover:bg-gold-50/50 transition-colors border border-transparent hover:border-gold-100"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-brown-900">{getPatientName(apt.patientId)}</p>
                                    <p className="text-sm text-brown-900 opacity-60">
                                        {getDoctorName(apt.doctorId)} • {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time}
                                    </p>
                                </div>
                                <span
                                    className={`badge ${apt.status === 'scheduled'
                                        ? 'badge-info'
                                        : apt.status === 'completed'
                                            ? 'badge-success'
                                            : 'badge-error'
                                        }`}
                                >
                                    {apt.status === 'scheduled' ? 'Agendada' : apt.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-xl font-semibold text-brown-900 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setCurrentView('patients')}
                        className="btn btn-primary flex items-center justify-center gap-2"
                    >
                        <span>👥</span>
                        <span>Novo Paciente</span>
                    </button>
                    {currentUser?.role === 'administrator' && (
                        <>
                            <button
                                onClick={() => setCurrentView('users')}
                                className="btn btn-primary flex items-center justify-center gap-2"
                            >
                                <span>➕</span>
                                <span>Novo Usuário</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('schedule')}
                                className="btn btn-secondary flex items-center justify-center gap-2 shadow-none"
                            >
                                <span>📊</span>
                                <span>Ver Agenda</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
