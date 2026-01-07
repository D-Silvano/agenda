import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface UserFormData {
    name: string;
    role: UserRole;
    cpf: string;
    email: string;
    confirmEmail: string;
    establishment: string;
    password: string;
}

const Users: React.FC = () => {
    const { addUser, users, isUsersLoading } = useApp();
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        role: 'health_professional',
        cpf: '',
        email: '',
        confirmEmail: '',
        establishment: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.email !== formData.confirmEmail) {
            alert('Os e-mails não coincidem.');
            return;
        }

        setIsSaving(true);
        try {
            console.log('Users: Submetendo formulário...', formData);
            const result = await addUser(formData);
            console.log('Users: Resultado do addUser:', result);
            if (result && (result as any).error) {
                alert('Aviso do Sistema: ' + (result as any).error);
            } else {
                setFormData({
                    name: '',
                    role: 'health_professional',
                    cpf: '',
                    email: '',
                    confirmEmail: '',
                    establishment: '',
                    password: '',
                });
                alert('Usuário cadastrado com sucesso!');
            }
        } catch (error: any) {
            alert('Erro ao cadastrar usuário: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setIsSaving(false);
        }
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
                            disabled={isSaving}
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
                            disabled={isSaving}
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
                            disabled={isSaving}
                        />
                    </div>
                    <div>
                        <label className="input-label">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="seu@email.com"
                            required
                            disabled={isSaving}
                        />
                    </div>
                    <div>
                        <label className="input-label">Confirmar E-mail</label>
                        <input
                            type="email"
                            name="confirmEmail"
                            value={formData.confirmEmail}
                            onChange={handleChange}
                            className="input"
                            placeholder="Repita o e-mail"
                            required
                            disabled={isSaving}
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
                            disabled={isSaving}
                        />
                    </div>
                    <div>
                        <label className="input-label">Senha de Acesso</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input !pr-10"
                                placeholder="********"
                                required
                                minLength={6}
                                disabled={isSaving}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-900/40 hover:text-brown-900 transition-colors"
                                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-brown-900/40 mt-1">Mínimo 6 caracteres.</p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gold-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary shadow-lg shadow-gold-500/20 px-8 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </span>
                        ) : 'Confirmar Cadastro'}
                    </button>
                </div>
            </form>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-brown-900">Usuários Cadastrados</h3>
                    {isUsersLoading && (
                        <div className="flex items-center gap-2 text-gold-DEFAULT">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs font-medium uppercase tracking-wider">Atualizando lista...</span>
                        </div>
                    )}
                </div>
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
                            {users.length === 0 && !isUsersLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-brown-900/40 italic">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
