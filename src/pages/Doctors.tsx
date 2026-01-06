import React from 'react';
import DoctorForm from '../components/DoctorForm';
import { useApp } from '../context/AppContext';

const Doctors: React.FC = () => {
    const { doctors, deleteDoctor } = useApp();

    return (
        <div className="space-y-6">
            <DoctorForm />

            <div className="card">
                <h3 className="text-xl font-semibold text-brown-900 mb-4">Lista de Médicos</h3>

                {doctors.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum médico cadastrado</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPF</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CRM</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Especialidade</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Procedimentos</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900">{doctor.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{doctor.cpf}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{doctor.crm}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            <span className="badge badge-info">{doctor.specialty}</span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            <div className="flex flex-wrap gap-1">
                                                {doctor.procedures.map((proc, idx) => (
                                                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {proc}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Tem certeza que deseja excluir este médico?')) {
                                                        deleteDoctor(doctor.id);
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                                title="Excluir Médico"
                                            >
                                                Excluir
                                            </button>
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

export default Doctors;
