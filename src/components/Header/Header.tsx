import React, { useState } from 'react';

interface HeaderProps {
    imageUrl?: string;
    height?: string;
    showUploadOption?: boolean;
    onImageChange?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    imageUrl = '',
    height = '150px',
    showUploadOption = true,
    onImageChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(imageUrl);
    const [previewUrl, setPreviewUrl] = useState(imageUrl);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewUrl(result);
                setTempUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (tempUrl) {
            setPreviewUrl(tempUrl);
            onImageChange?.(tempUrl);
            setIsEditing(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl('');
        setTempUrl('');
        onImageChange?.('');
        setIsEditing(false);
    };

    return (
        <div className="header-container relative w-full overflow-hidden">
            {previewUrl ? (
                <div className="relative group" style={{ height }}>
                    <img
                        src={previewUrl}
                        alt="Header Banner"
                        className="w-full h-full object-cover animate-fade-in"
                    />

                    {/* Overlay gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

                    {showUploadOption && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-secondary backdrop-blur-md bg-white/90 hover:bg-white shadow-lg"
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                            <button
                                onClick={handleRemoveImage}
                                className="btn bg-red-500 hover:bg-red-600 text-white backdrop-blur-md shadow-lg"
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remover
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                showUploadOption && (
                    <div
                        className="flex items-center justify-center bg-gradient-to-br from-gold-50 to-gold-100 border-2 border-dashed border-gold-200 hover:border-gold-light transition-colors cursor-pointer animate-fade-in"
                        style={{ height }}
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="text-center p-4">
                            <svg className="w-10 h-10 mx-auto text-gold-DEFAULT mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-brown-900 mb-2">Adicionar Imagem de Banner</h3>
                            <p className="text-brown-900/60">Clique para adicionar uma imagem ao topo da página</p>
                        </div>
                    </div>
                )
            )}

            {/* Modal de edição */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Configurar Imagem do Header</h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Upload de arquivo */}
                            <div>
                                <label className="input-label">Upload de Imagem</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gold-200 rounded-lg hover:border-gold-DEFAULT transition-colors cursor-pointer bg-gold-50/20 hover:bg-gold-50/50"
                                    >
                                        <svg className="w-6 h-6 mr-2 text-gold-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-brown-900 font-medium">Escolher arquivo do computador</span>
                                    </label>
                                </div>
                            </div>

                            {/* Divisor */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
                                </div>
                            </div>

                            {/* URL da imagem */}
                            <div>
                                <label className="input-label">URL da Imagem</label>
                                <input
                                    type="url"
                                    value={tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="input"
                                />
                            </div>

                            {/* Preview */}
                            {tempUrl && (
                                <div className="animate-slide-up">
                                    <label className="input-label">Preview</label>
                                    <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                                        <img
                                            src={tempUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover"
                                            onError={() => setTempUrl('')}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Botões de ação */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleUrlSubmit}
                                    disabled={!tempUrl}
                                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Aplicar Imagem
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setTempUrl(previewUrl);
                                    }}
                                    className="btn btn-outline"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
