import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
    const { login } = useApp();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!cpf || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        login(cpf, password);
    };

    return (
        <div className="min-h-screen login-gradient flex items-center justify-center p-4">
            <div className="card w-full max-w-md shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/90">
                <div className="text-center mb-8 pt-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-brown-900 to-gold-DEFAULT bg-clip-text text-transparent">
                        MediAgenda
                    </h2>
                    <p className="text-sm font-medium text-brown-900/60 uppercase tracking-[0.2em] mt-2">Portal de Acesso</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-1">
                        <label className="input-label !text-brown-900">CPF</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT text-lg group-focus-within:scale-110 transition-transform">👤</span>
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                className="input !pl-10 !bg-white/50 focus:!bg-white"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="input-label !text-brown-900">Senha</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT text-lg group-focus-within:scale-110 transition-transform">🔒</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input !pl-10 !bg-white/50 focus:!bg-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full py-4 !text-base shadow-xl hover:-translate-y-0.5 transition-all">
                        Entrar no Sistema
                    </button>
                </form>
                <p className="text-center text-xs text-brown-900/40 mt-4">
                    Utilize seu CPF e senha cadastrados para entrar.
                    <br />
                    Portal restrito a colaboradores autorizados.
                </p>
            </div>
        </div>
    );
};

export default Login;
