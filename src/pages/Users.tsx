import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface UserFormData {
    name: string;
    role: UserRole;
    cpf: string;
    establishment: string;
    password: string;
}

const Users: React.FC = () => {
    const { addUser, users } = useApp();

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        role: 'health_professional',
        cpf: '',
        establishment: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser(formData);
        setFormData({
            name: '',
            role: 'health_professional',
            cpf: '',
            establishment: '',
            password: '',
        });
        alert('Usuário cadastrado com sucesso!');
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="card max-w-4xl mx-auto border-gold-100 shadow-xl overflow-hidden">
                <div className="border-b border-gold-100 bg-gold-50/30 -mx-8 -mt-8 px-8 py-6 mb-8">
                    <h3 className="text-2xl font-bold text-brown-900">Cadastrar Novo Usuário</h3>
                    <p className="text-sm text-brown-900/60 mt-1">Crie credenciais de acesso para novos profissionais ou administradores.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="input-label">Nome Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>
                    <div>
                        <label className="input-label">Função / Cargo</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="administrator">Administrador</option>
                            <option value="health_professional">Profissional de Saúde</option>
                        </select>
                    </div>
                    <div>
                        <label className="input-label">CPF (Login)</label>
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
                        <label className="input-label">Estabelecimento / Unidade</label>
                        <input
                            type="text"
                            name="establishment"
                            value={formData.establishment}
                            onChange={handleChange}
                            className="input"
                            placeholder="Nome da UBS ou Hospital"
                            required
                        />
                    </div>
                    <div>
                        <label className="input-label">Senha de Acesso</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="********"
                            required
                        />
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gold-100 flex justify-end">
                    <button type="submit" className="btn btn-primary shadow-lg shadow-gold-500/20 px-8">
                        Confirmar Cadastro
                    </button>
                </div>
            </form>

            <div className="card">
                <h3 className="text-xl font-semibold text-brown-900 mb-4">Usuários Cadastrados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Função</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPF</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estabelecimento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{user.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        <span className={`badge ${user.role === 'administrator' ? 'badge-info' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.role === 'administrator' ? 'Administrador' : 'Prof. Saúde'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{user.cpf}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{user.establishment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
