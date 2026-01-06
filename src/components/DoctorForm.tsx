import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface DoctorFormData {
    name: string;
    cpf: string;
    specialty: string;
    crm: string;
    procedures: string;
}

const DoctorForm: React.FC = () => {
    const { addDoctor } = useApp();
    const [formData, setFormData] = useState<DoctorFormData>({
        name: '',
        cpf: '',
        specialty: '',
        crm: '',
        procedures: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const proceduresArray = formData.procedures
            .split(',')
            .map(p => p.trim())
            .filter(p => p !== '');

        addDoctor({
            name: formData.name,
            cpf: formData.cpf,
            specialty: formData.specialty,
            crm: formData.crm,
            procedures: proceduresArray,
        });

        setFormData({
            name: '',
            cpf: '',
            specialty: '',
            crm: '',
            procedures: '',
        });
        alert('Médico cadastrado com sucesso!');
    };

    return (
        <form onSubmit={handleSubmit} className="card max-w-4xl mx-auto border-gold-100 shadow-xl overflow-hidden">
            <div className="border-b border-gold-100 bg-gold-50/30 -mx-8 -mt-8 px-8 py-6 mb-8">
                <h3 className="text-2xl font-bold text-brown-900">Cadastrar Novo Médico</h3>
                <p className="text-sm text-brown-900/60 mt-1">Preencha os dados profissionais do corpo clínico.</p>
            </div>

            <div className="space-y-8">
                {/* Seção 1: Identificação */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gold-DEFAULT text-white flex items-center justify-center text-sm font-bold">1</span>
                        <h4 className="font-semibold text-brown-900 uppercase tracking-wider text-sm">Dados de Identificação</h4>
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
                                placeholder="Ex: Dr. João Silva"
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
                            <label className="input-label">CRM *</label>
                            <input
                                type="text"
                                name="crm"
                                value={formData.crm}
                                onChange={handleChange}
                                className="input"
                                placeholder="00000-UF"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Seção 2: Atuação */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gold-DEFAULT text-white flex items-center justify-center text-sm font-bold">2</span>
                        <h4 className="font-semibold text-brown-900 uppercase tracking-wider text-sm">Especialidade e Atendimento</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Especialidade Principal *</label>
                            <input
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ex: Cardiologia"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Procedimentos (separados por vírgula) *</label>
                            <input
                                type="text"
                                name="procedures"
                                value={formData.procedures}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ex: Consulta, Eletrocardiograma, Avaliação"
                                required
                            />
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-10 pt-6 border-t border-gold-100 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setFormData({
                        name: '',
                        cpf: '',
                        specialty: '',
                        crm: '',
                        procedures: '',
                    })}
                    className="btn btn-secondary border-none shadow-none text-brown-900/60 hover:text-brown-900"
                >
                    Limpar Tudo
                </button>
                <button type="submit" className="btn btn-primary shadow-lg shadow-gold-500/20 px-8">
                    Confirmar Cadastro
                </button>
            </div>
        </form>
    );
};

export default DoctorForm;
