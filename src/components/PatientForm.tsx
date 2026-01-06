import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';

interface PatientFormData {
    name: string;
    cpf: string;
    phone: string;
    basicHealthUnit: string;
    address: string;
    susCard: string;
    communityAgent: string;
    doctorType: string;
}

interface PatientFormProps {
    patientToEdit?: Patient | null;
    onCancel?: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patientToEdit, onCancel }) => {
    const { addPatient, updatePatient, doctors, currentUser } = useApp();
    const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
    const procedures = Array.from(new Set(doctors.flatMap(d => d.procedures)));
    const allOptions = Array.from(new Set([...specialties, ...procedures])).sort();

    const initialFormState: PatientFormData = {
        name: '',
        cpf: '',
        phone: '',
        basicHealthUnit: currentUser?.role === 'health_professional' ? currentUser.establishment : '',
        address: '',
        susCard: '',
        communityAgent: '',
        doctorType: '',
    };

    const [formData, setFormData] = useState<PatientFormData>(initialFormState);

    useEffect(() => {
        if (patientToEdit) {
            setFormData({
                name: patientToEdit.name,
                cpf: patientToEdit.cpf,
                phone: patientToEdit.phone,
                basicHealthUnit: patientToEdit.basicHealthUnit,
                address: patientToEdit.address,
                susCard: patientToEdit.susCard,
                communityAgent: patientToEdit.communityAgent,
                doctorType: patientToEdit.doctorType,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [patientToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (patientToEdit) {
            updatePatient(patientToEdit.id, formData);
            alert('Paciente atualizado com sucesso!');
            if (onCancel) onCancel();
        } else {
            addPatient(formData);
            alert('Paciente cadastrado com sucesso!');
        }

        setFormData(initialFormState);
    };

    const handleClear = () => {
        if (patientToEdit && onCancel) {
            onCancel();
        } else {
            setFormData(initialFormState);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card max-w-4xl mx-auto border-gold-100 shadow-xl overflow-hidden">
            <div className="border-b border-gold-100 bg-gold-50/30 -mx-8 -mt-8 px-8 py-6 mb-8">
                <h3 className="text-2xl font-bold text-brown-900">
                    {patientToEdit ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
                </h3>
                <p className="text-sm text-brown-900/60 mt-1">
                    {patientToEdit
                        ? 'Atualize as informações do paciente no prontuário eletrônico.'
                        : 'Insira as informações do paciente para o prontuário eletrônico.'}
                </p>
            </div>

            <div className="space-y-8">
                {/* Seção 1: Dados Pessoais */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gold-DEFAULT text-white flex items-center justify-center text-sm font-bold">1</span>
                        <h4 className="font-semibold text-brown-900 uppercase tracking-wider text-sm">Informações Pessoais</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Nome Completo *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome completo do paciente"
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">CPF *</label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                className="input"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">Telefone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Seção 2: Localização e Saúde */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gold-DEFAULT text-white flex items-center justify-center text-sm font-bold">2</span>
                        <h4 className="font-semibold text-brown-900 uppercase tracking-wider text-sm">Endereço e Prontuário</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Endereço Residencial *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input"
                                placeholder="Rua, número, bairro..."
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">Unidade Básica de Saúde (UBS) *</label>
                            <input
                                type="text"
                                name="basicHealthUnit"
                                value={formData.basicHealthUnit}
                                onChange={handleChange}
                                className={`input ${currentUser?.role === 'health_professional' ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}`}
                                placeholder="Nome da UBS de referência"
                                required
                                disabled={currentUser?.role === 'health_professional'}
                            />
                            {currentUser?.role === 'health_professional' && (
                                <p className="text-[10px] text-gold-600 font-medium mt-1 uppercase tracking-wider">UBS vinculada ao seu cadastro</p>
                            )}
                        </div>
                        <div>
                            <label className="input-label">Cartão do SUS *</label>
                            <input
                                type="text"
                                name="susCard"
                                value={formData.susCard}
                                onChange={handleChange}
                                className="input"
                                placeholder="Número do cartão SUS"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Seção 3: Vínculo Clínico */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gold-DEFAULT text-white flex items-center justify-center text-sm font-bold">3</span>
                        <h4 className="font-semibold text-brown-900 uppercase tracking-wider text-sm">Acompanhamento</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="input-label">Agente Comunitário de Saúde *</label>
                            <input
                                type="text"
                                name="communityAgent"
                                value={formData.communityAgent}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome do ACS"
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">Especialidade/Procedimento Necessário *</label>
                            <select
                                name="doctorType"
                                value={formData.doctorType}
                                onChange={(e) => setFormData({ ...formData, doctorType: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="">Selecione a necessidade</option>
                                {allOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-10 pt-6 border-t border-gold-100 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="btn btn-secondary border-none shadow-none text-brown-900/60 hover:text-brown-900"
                >
                    {patientToEdit ? 'Cancelar' : 'Limpar Formulário'}
                </button>
                <button type="submit" className="btn btn-primary shadow-lg shadow-gold-500/20 px-8">
                    {patientToEdit ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </button>
            </div>
        </form>
    );
};

export default PatientForm;
