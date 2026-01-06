import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ImageHeader from '../Header/Header';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { currentUser } = useApp();
    const [headerImageUrl, setHeaderImageUrl] = useState<string>('');

    return (
        <div className="min-h-screen bg-white">
            <Sidebar />
            <div className="ml-64">
                <ImageHeader
                    imageUrl={headerImageUrl}
                    height="150px"
                    showUploadOption={currentUser?.role === 'administrator'}
                    onImageChange={setHeaderImageUrl}
                />
                <Header />
                <main className="p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
