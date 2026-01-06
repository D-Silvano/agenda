import React from 'react';
import { useApp } from '../context/AppContext';

const AppointmentsList: React.FC = () => {
    const { appointments, patients, doctors, currentUser } = useApp();

    // Filter appointments: 
    // 1. Created by administrator
    // 2. Patient was registered by the current logged-in user
    const notifications = appointments.filter(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        return apt.createdByRole === 'administrator' && patient?.registeredBy === currentUser?.id;
    });

    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Paciente não encontrado';
    const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'Médico não encontrado';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-brown-900">Suas Notificações de Agendamento</h3>
                    <p className="text-sm text-brown-900/60 mt-1">
                        Agendamentos realizados pela administração para pacientes cadastrados por você.
                    </p>
                </div>
                <div className="bg-gold-50 px-4 py-2 rounded-lg border border-gold-100">
                    <span className="text-sm font-semibold text-gold-DEFAULT">
                        {notifications.length} {notifications.length === 1 ? 'Notificação' : 'Notificações'}
                    </span>
                </div>
            </div>

            <div className="card overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📭</span>
                        </div>
                        <p className="text-gray-500 font-medium">Nenhum agendamento novo no momento</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gold-50 bg-gold-50/20">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-brown-900 uppercase tracking-wider">Paciente</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-brown-900 uppercase tracking-wider">Médico</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-brown-900 uppercase tracking-wider">Data</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-brown-900 uppercase tracking-wider">Hora</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-brown-900 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((apt) => (
                                    <tr key={apt.id} className="border-b border-gray-100 last:border-0 hover:bg-gold-50/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-semibold text-brown-900">{getPatientName(apt.patientId)}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-brown-900/80">{getDoctorName(apt.doctorId)}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-brown-900/60 font-medium">{apt.date}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-brown-900/60">{apt.time}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${apt.status === 'scheduled' ? 'badge-info' :
                                                apt.status === 'completed' ? 'badge-success' : 'badge-error'
                                                }`}>
                                                {apt.status === 'scheduled' ? 'Agendado' :
                                                    apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsList;
