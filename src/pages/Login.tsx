import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
    const { login } = useApp();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        if (!cpf || !password) {
            setError('Por favor, preencha todos os campos.');
            setIsLoggingIn(false);
            return;
        }

        const result = await login(cpf, password);
        if (result.error) {
            setError(result.error);
            setIsLoggingIn(false);
        }
        // Redirection is handled by AppContext session listener
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
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="input-label !text-brown-900">Senha</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT text-lg group-focus-within:scale-110 transition-transform">🔒</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input !pl-10 !pr-10 !bg-white/50 focus:!bg-white"
                                placeholder="••••••••"
                                required
                                disabled={isLoggingIn}
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
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="btn btn-primary w-full py-4 !text-base shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Entrando...
                            </span>
                        ) : 'Entrar no Sistema'}
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
