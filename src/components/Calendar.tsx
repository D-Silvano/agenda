import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Calendar: React.FC = () => {
    const {
        schedulingLists,
        patients,
        doctors,
        addSchedulingList,
        deleteSchedulingList,
        addPatientToList,
        removePatientFromList
    } = useApp();
    const [showNewListForm, setShowNewListForm] = useState(false);
    const [newListData, setNewListData] = useState({
        name: '',
        date: '',
        doctorId: '',
        doctorType: '',
    });
    const [activeListForAdding, setActiveListForAdding] = useState<string | null>(null);

    const getPatientById = (id: string) => patients.find(p => p.id === id);
    const getDoctorById = (id: string) => doctors.find(d => d.id === id);

    const handleDoctorChange = (doctorId: string) => {
        const doctor = getDoctorById(doctorId);
        setNewListData({
            ...newListData,
            doctorId,
            doctorType: doctor?.specialty || ''
        });
    };

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListData.doctorId) return;

        addSchedulingList({
            name: newListData.name,
            date: newListData.date,
            doctorId: newListData.doctorId,
            doctorType: newListData.doctorType,
            patientIds: []
        });
        setNewListData({ name: '', date: '', doctorId: '', doctorType: '' });
        setShowNewListForm(false);
    };

    const togglePatientSelection = (listId: string | null) => {
        setActiveListForAdding(listId);
    };

    const handleAddPatientToList = (listId: string, patientId: string) => {
        addPatientToList(listId, patientId);
        setActiveListForAdding(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Listas de Agendamento</h3>
                <button
                    onClick={() => setShowNewListForm(!showNewListForm)}
                    className="btn btn-primary"
                >
                    {showNewListForm ? 'Cancelar' : 'Nova Lista'}
                </button>
            </div>

            {showNewListForm && (
                <form onSubmit={handleCreateList} className="card bg-gray-50 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="input-label">Nome da Lista</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={newListData.name}
                                onChange={e => setNewListData({ ...newListData, name: e.target.value })}
                                placeholder="Ex: Mutirão Segunda"
                            />
                        </div>
                        <div>
                            <label className="input-label">Data</label>
                            <input
                                type="date"
                                required
                                className="input"
                                value={newListData.date}
                                onChange={e => setNewListData({ ...newListData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="input-label">Médico</label>
                            <select
                                required
                                className="input"
                                value={newListData.doctorId}
                                onChange={e => handleDoctorChange(e.target.value)}
                            >
                                <option value="">Selecione o Médico</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Especialidade ou Procedimento</label>
                            <select
                                required
                                className="input"
                                value={newListData.doctorType}
                                onChange={e => setNewListData({ ...newListData, doctorType: e.target.value })}
                            >
                                <option value="">Selecione o Procedimento</option>
                                {newListData.doctorId && (
                                    <>
                                        <option value={getDoctorById(newListData.doctorId)?.specialty}>
                                            {getDoctorById(newListData.doctorId)?.specialty} (Principal)
                                        </option>
                                        {getDoctorById(newListData.doctorId)?.procedures.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full md:w-auto">Criar Lista</button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-6">
                {schedulingLists.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">Nenhuma lista de agendamento criada.</p>
                    </div>
                ) : (
                    schedulingLists.map(list => {
                        const doctor = getDoctorById(list.doctorId);
                        return (
                            <div key={list.id} className="card hover:shadow-md transition-shadow relative">
                                <div className="flex justify-between items-start mb-4 border-b pb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-gold-DEFAULT">{list.name}</h4>
                                        <div className="flex gap-4 text-sm text-brown-900/60">
                                            <span>📅 {new Date(list.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                            <span>👨‍⚕️ {doctor?.name}</span>
                                            <span className="badge badge-info">{list.doctorType}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => togglePatientSelection(list.id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            + Paciente
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Tem certeza que deseja excluir esta lista?')) {
                                                    deleteSchedulingList(list.id);
                                                }
                                            }}
                                            className="btn btn-outline-red btn-sm"
                                            title="Excluir Lista"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {list.patientIds.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Nenhum paciente na lista.</p>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b">
                                                    <th className="pb-2">Nome</th>
                                                    <th className="pb-2">CPF</th>
                                                    <th className="pb-2 text-right">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.patientIds.map(pid => {
                                                    const patient = getPatientById(pid);
                                                    return (
                                                        <tr key={pid} className="border-b border-gray-50 last:border-0">
                                                            <td className="py-2">{patient?.name}</td>
                                                            <td className="py-2 text-gray-600">{patient?.cpf}</td>
                                                            <td className="py-2 text-right">
                                                                <button
                                                                    onClick={() => removePatientFromList(list.id, pid)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    Remover
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {activeListForAdding === list.id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
                                            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                                <div>
                                                    <h3 className="text-xl font-bold text-brown-900">Selecionar Paciente</h3>
                                                    <p className="text-sm text-brown-900/60">
                                                        Filtrado por: <span className="font-semibold text-gold-DEFAULT">{list.doctorType}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setActiveListForAdding(null)}
                                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                                >
                                                    &times;
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-auto p-6">
                                                <table className="w-full">
                                                    <thead className="sticky top-0 bg-white">
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPF</th>
                                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">UBS</th>
                                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ação</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {patients
                                                            .filter(p => p.doctorType === list.doctorType && !list.patientIds.includes(p.id))
                                                            .map(patient => (
                                                                <tr key={patient.id} className="hover:bg-gray-50">
                                                                    <td className="py-3 px-4 text-sm text-gray-900">{patient.name}</td>
                                                                    <td className="py-3 px-4 text-sm text-gray-600">{patient.cpf}</td>
                                                                    <td className="py-3 px-4 text-sm text-gray-600">{patient.basicHealthUnit}</td>
                                                                    <td className="py-3 px-4 text-right">
                                                                        <button
                                                                            onClick={() => handleAddPatientToList(list.id, patient.id)}
                                                                            className="btn btn-primary btn-sm"
                                                                        >
                                                                            Adicionar
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        {patients.filter(p => p.doctorType === list.doctorType && !list.patientIds.includes(p.id)).length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                                                    Nenhum paciente disponível para este filtro.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="p-4 border-t bg-gray-50 text-right">
                                                <button
                                                    onClick={() => setActiveListForAdding(null)}
                                                    className="btn btn-secondary"
                                                >
                                                    Fechar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Calendar;
