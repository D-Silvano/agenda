import React, { useState } from 'react';
import PatientForm from '../components/PatientForm';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';

const Patients: React.FC = () => {
    const { patients, deletePatient, currentUser, doctors, schedulingLists, appointments } = useApp();
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    // Password Verification State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [verificationPassword, setVerificationPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [pendingAction, setPendingAction] = useState<{ type: 'edit' | 'delete', patient: Patient } | null>(null);

    // Filter State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        cpf: '',
        specialty: ''
    });

    const specialties = Array.from(new Set(doctors.map(d => d.specialty))).sort();

    const executeDelete = (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o paciente ${name}?`)) {
            deletePatient(id);
        }
    };

    const handleClearFilters = () => {
        setFilters({ name: '', cpf: '', specialty: '' });
    };

    const filteredPatients = patients.filter(patient => {
        const matchesName = patient.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesCpf = patient.cpf.includes(filters.cpf);
        const matchesSpecialty = filters.specialty === '' || patient.doctorType === filters.specialty;

        // Restriction for Health Professionals: Can only see patients they registered
        const matchesUser = currentUser?.role === 'health_professional'
            ? patient.registeredBy === currentUser.id
            : true;

        return matchesName && matchesCpf && matchesSpecialty && matchesUser;
    });

    const canEditOrDelete = (patient: Patient) => {
        if (!currentUser) return false;
        if (currentUser.role === 'administrator') return true;
        return currentUser.role === 'health_professional' && patient.basicHealthUnit === currentUser.establishment;
    };

    const hasAnyActionPermission = filteredPatients.some(canEditOrDelete);

    const handleActionClick = (type: 'edit' | 'delete', patient: Patient) => {
        if (currentUser?.role === 'administrator') {
            if (type === 'edit') setEditingPatient(patient);
            else executeDelete(patient.id, patient.name);
        } else if (currentUser?.role === 'health_professional') {
            setPendingAction({ type, patient });
            setIsPasswordModalOpen(true);
            setVerificationPassword('');
            setPasswordError('');
        }
    };

    const handlePasswordConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationPassword === currentUser?.password) {
            if (pendingAction) {
                if (pendingAction.type === 'edit') setEditingPatient(pendingAction.patient);
                else executeDelete(pendingAction.patient.id, pendingAction.patient.name);
            }
            setIsPasswordModalOpen(false);
            setPendingAction(null);
        } else {
            setPasswordError('Senha incorreta. Tente novamente.');
        }
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <div className="space-y-6">
            <PatientForm
                patientToEdit={editingPatient}
                onCancel={() => setEditingPatient(null)}
            />

            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-brown-900">Lista de Pacientes</h3>
                        {activeFiltersCount > 0 && (
                            <span className="badge badge-info">
                                {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="btn btn-secondary border-none text-red-500 hover:text-red-700 text-sm py-2"
                            >
                                Limpar Filtros
                            </button>
                        )}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="btn btn-secondary flex items-center gap-2 border-gold-200 text-brown-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filtrar
                        </button>
                    </div>
                </div>

                {/* Filter Modal */}
                {isFilterModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gold-50 px-6 py-4 border-b border-gold-100 flex justify-between items-center">
                                <h4 className="text-lg font-bold text-brown-900">Filtrar Pacientes</h4>
                                <button
                                    onClick={() => setIsFilterModalOpen(false)}
                                    className="text-brown-900/40 hover:text-brown-900 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="input-label">Nome do Paciente</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Buscar por nome..."
                                        value={filters.name}
                                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">CPF</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="000.000.000-00"
                                        value={filters.cpf}
                                        onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Especialidade / Necessidade</label>
                                    <select
                                        className="input"
                                        value={filters.specialty}
                                        onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                                    >
                                        <option value="">Todas as especialidades</option>
                                        {specialties.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={handleClearFilters}
                                    className="btn btn-secondary border-none"
                                >
                                    Limpar
                                </button>
                                <button
                                    onClick={() => setIsFilterModalOpen(false)}
                                    className="btn btn-primary px-8"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Verification Modal */}
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gold-50 px-6 py-4 border-b border-gold-100 text-center">
                                <h4 className="text-lg font-bold text-brown-900">Confirmação de Segurança</h4>
                                <p className="text-xs text-brown-900/60 mt-1 uppercase tracking-wider font-semibold">Insira sua senha para continuar</p>
                            </div>
                            <form onSubmit={handlePasswordConfirm} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="input-label">Senha de Acesso</label>
                                    <input
                                        type="password"
                                        className={`input ${passwordError ? 'border-red-500 bg-red-50/50' : ''}`}
                                        placeholder="••••••••"
                                        value={verificationPassword}
                                        onChange={(e) => setVerificationPassword(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                    {passwordError && (
                                        <p className="text-xs text-red-500 font-medium">⚠️ {passwordError}</p>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPasswordModalOpen(false);
                                            setPendingAction(null);
                                        }}
                                        className="btn btn-secondary flex-1"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {filteredPatients.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">Nenhum paciente encontrado com esses filtros</p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="text-gold-DEFAULT hover:underline mt-2 text-sm"
                            >
                                Limpar todos os filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPF</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefone</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">UBS</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Agente</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo de Médico</th>
                                    {hasAnyActionPermission && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="border-b border-gray-100 hover:bg-gold-50/10 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{patient.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{patient.cpf}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{patient.phone}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{patient.basicHealthUnit}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{patient.communityAgent}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {(() => {
                                                const scheduledList = schedulingLists.find(list => list.patientIds.includes(patient.id));
                                                const scheduledAppointment = appointments.find(apt => apt.patientId === patient.id && apt.status === 'scheduled');

                                                const isScheduled = !!scheduledList || !!scheduledAppointment;
                                                const scheduledDate = scheduledList
                                                    ? new Date(scheduledList.date + 'T00:00:00').toLocaleDateString('pt-BR')
                                                    : scheduledAppointment
                                                        ? new Date(scheduledAppointment.date + 'T00:00:00').toLocaleDateString('pt-BR')
                                                        : '';

                                                return (
                                                    <span
                                                        className={`badge ${isScheduled ? 'bg-green-100 text-green-800 border-green-200' : 'badge-info'} cursor-help`}
                                                        title={isScheduled ? `Agendado para: ${scheduledDate}` : ''}
                                                    >
                                                        {patient.doctorType}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        {hasAnyActionPermission && (
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {canEditOrDelete(patient) && (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleActionClick('edit', patient)}
                                                            className="text-gold-DEFAULT hover:text-gold-600 font-semibold transition-colors"
                                                            title="Editar"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionClick('delete', patient)}
                                                            className="text-red-400 hover:text-red-600 font-semibold transition-colors"
                                                            title="Excluir"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
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

export default Patients;
